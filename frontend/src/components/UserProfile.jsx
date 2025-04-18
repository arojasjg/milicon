import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import notificationService from '../services/notificationService';
import './UserProfile.css';

// Componente para mostrar el perfil del usuario
// Ultima actualizacion: mayo 2023
// TODO: conectar con la API real cuando este lista
const UserProfile = () => {
  const { success, error, info, notify } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // datos fake para pruebas - reemplazar con API
  // FIXME: a veces se borra cuando vuelves para atras
  const [data, setData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  });
  
  // errores del formulario
  const [errors, setErrors] = useState({});
  
  // handle para cambios en inputs
  function handleChange(e) {
    const { name, value } = e.target;
    
    // actualizar estado con nuevo valor
    setData({
      ...data,
      [name]: value
    });
    
    // quitar error cuando el usuario escribe
    if (errors[name]) {
      let newErrors = {...errors};
      delete newErrors[name]; // mejor que poner null
      setErrors(newErrors);
    }
  };
  
  // validacion del formulario
  const validate = () => {
    let err = {};
    let valid = true;
    
    // campos obligatorios
    if (!data.firstName || !data.firstName.trim()) {
      err.firstName = 'Nombre es obligatorio';
      valid = false;
    }
    
    if (!data.lastName || !data.lastName.trim()) {
      err.lastName = 'Apellido es obligatorio';
      valid = false;
    }
    
    // validar email con regex simple
    // esto lo saque de stackoverflow pero funciona
    if (!data.email || !data.email.trim()) {
      err.email = 'Email es obligatorio';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      err.email = 'Email no válido';
      valid = false;
    }
    
    setErrors(err);
    return valid;
  };
  
  // manejar submit del form de perfil
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // primero validar form
    if (!validate()) {
      // mostrar error
      error('Por favor corrige los errores', {
        title: 'Error de validación',
        autoClose: true,
        duration: 5000
      });
      return;
    }
    
    setLoading(true);
    
    // simulacion de llamada API - luego reemplazar
    const updateApi = () => {
      return new Promise((resolve, reject) => {
        // delay artificial para ver el loading
        setTimeout(() => {
          // exito o error random para probar 
          if (Math.random() > 0.2) { 
            resolve({
              success: true,
              data: data,
              message: 'Perfil actualizado correctamente'
            });
          } else {
            // simular error de API
            reject({
              response: {
                data: {
                  message: 'Error en servidor',
                  error: 'Error interno'
                },
                status: 500
              }
            });
          }
        }, 1500);
      });
    };
    
    try {
      /* 
        Uso mi servicio de notificaciones para manejar la llamada
        Me ahorra mucho codigo en todos lados
      */
      const n = { success, error, info, notify };
      await notificationService.handleApiCall(
        updateApi,
        n,
        {
          successOptions: {
            title: 'Perfil Actualizado',
            message: 'Tu perfil ha sido actualizado correctamente',
            duration: 5000
          },
          errorOptions: {
            title: 'Error de Actualización',
            duration: 7000
          }
        }
      );
    } catch (e) {
      // loggear pero no crashear app
      console.error('Error al actualizar perfil:', e);
      // ya mostramos error desde service
    } finally {
      setLoading(false);
    }
  };
  
  // manejar direcciones con notification loading
  // TODO: refactorizar esto junto con el anterior para no repetir codigo
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // simulacion de API con notificacion de loading
      const updateDirApi = () => {
        return new Promise((resolve) => {
          // aca podria fallar pero no lo necesito para demo
          setTimeout(() => {
            resolve({
              success: true,
              message: 'Dirección actualizada'
            });
          }, 3000); // extra lento para mostrar loading
        });
      };
      
      const n = { success, error, info, notify };
      await notificationService.handleLoadingOperation(
        updateDirApi,
        n,
        {
          loadingTitle: 'Actualizando Dirección',
          loadingMessage: 'Espera mientras actualizamos tu dirección...',
          successTitle: 'Dirección Actualizada',
          successMessage: 'Tu dirección ha sido actualizada correctamente'
        }
      );
    } catch (e) {
      console.error('Error en dirección:', e);
    }
  };
  
  // borrar dirección con confirmación
  const handleDeleteAddress = () => {
    // usando el sistema de notificaciones para confirmar
    notify({
      type: 'warning',
      title: 'Confirmar Eliminación',
      message: '¿Estás seguro de eliminar esta dirección?',
      autoClose: false, // no cerrar automaticamente los dialogs
      actions: [
        {
          label: 'Eliminar',
          onClick: (close) => {
            // cerrar notificacion
            close();
            
            // mostrar notificacion exito después del "borrado"
            // pequeño delay para q se vea mas natural
            setTimeout(() => {
              success('Dirección eliminada', {
                title: 'Dirección Eliminada',
                duration: 5000
              });
            }, 500);
          },
          variant: 'primary'
        },
        {
          label: 'Cancelar',
          onClick: (close) => close(),
          variant: 'secondary'
        }
      ]
    });
  };
  
  // console.log("rendering profile", data);
  
  return (
    <div className="user-profile-container">
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Perfil
        </button>
        <button 
          className={`tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
          onClick={() => setActiveTab('addresses')}
        >
          Direcciones
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Pedidos
        </button>
      </div>
      
      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-tab">
            <div className="profile-header">
              <h2>Información de Perfil</h2>
            </div>
            
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className={`form-group ${errors.firstName ? 'has-error' : ''}`}>
                <label htmlFor="firstName">Nombre</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={data.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? 'input-error' : ''}
                />
                {errors.firstName && (
                  <div className="error-message">{errors.firstName}</div>
                )}
              </div>
              
              <div className={`form-group ${errors.lastName ? 'has-error' : ''}`}>
                <label htmlFor="lastName">Apellido</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={data.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? 'input-error' : ''}
                />
                {errors.lastName && (
                  <div className="error-message">{errors.lastName}</div>
                )}
              </div>
              
              <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Teléfono</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={data.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bio">Biografía</label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  value={data.bio}
                  onChange={handleChange}
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    info('Cambios descartados', {
                      title: 'Cancelado',
                      duration: 3000
                    });
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
        
        {activeTab === 'addresses' && (
          <div className="addresses-tab">
            <div className="profile-header">
              <h2>Tus Direcciones</h2>
            </div>
            
            <div className="address-container">
              <div className="address-card">
                <h3>Casa</h3>
                <p>123 Main Street</p>
                <p>Apt 4B</p>
                <p>New York, NY 10001</p>
                <div className="address-actions">
                  <button className="edit-address-btn" onClick={handleAddressSubmit}>
                    Editar
                  </button>
                  <button className="delete-address-btn" onClick={handleDeleteAddress}>
                    Eliminar
                  </button>
                </div>
              </div>
              
              <div className="address-card">
                <h3>Trabajo</h3>
                <p>456 Office Plaza</p>
                <p>Suite 300</p>
                <p>New York, NY 10018</p>
                <div className="address-actions">
                  <button className="edit-address-btn" onClick={handleAddressSubmit}>
                    Editar
                  </button>
                  <button className="delete-address-btn" onClick={handleDeleteAddress}>
                    Eliminar
                  </button>
                </div>
              </div>
              
              <button className="add-address-btn" onClick={() => {
                info('Esta función estará disponible próximamente!', {
                  title: 'No implementado',
                  duration: 3000
                });
              }}>
                Añadir Nueva Dirección
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="orders-tab">
            <div className="profile-header">
              <h2>Tus Pedidos</h2>
            </div>
            
            <div className="empty-state">
              <p>No tienes pedidos todavía.</p>
              <button className="shop-now-btn" onClick={() => {
                info('Tienda próximamente!', {
                  title: 'No implementado',
                  duration: 3000
                });
              }}>
                Comprar Ahora
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 