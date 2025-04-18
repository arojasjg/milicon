package com.miliconstore.userservice.service;

import com.miliconstore.userservice.dto.AddressDto;
import com.miliconstore.userservice.dto.UserProfileDto;
import com.miliconstore.userservice.entity.Address;
import com.miliconstore.userservice.entity.User;
import com.miliconstore.userservice.entity.UserProfile;
import com.miliconstore.userservice.repository.AddressRepository;
import com.miliconstore.userservice.repository.UserProfileRepository;
import com.miliconstore.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserProfileService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final AddressRepository addressRepository;

    @Autowired
    public UserProfileService(UserRepository userRepository,
            UserProfileRepository userProfileRepository,
            AddressRepository addressRepository) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.addressRepository = addressRepository;
    }

    @Transactional
    public UserProfile createOrUpdateProfile(Long userId, UserProfileDto profileDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElse(new UserProfile());

        profile.setUser(user);
        profile.setPhoneNumber(profileDto.getPhoneNumber());
        profile.setDateOfBirth(profileDto.getDateOfBirth());
        profile.setGender(profileDto.getGender());

        return userProfileRepository.save(profile);
    }

    @Transactional
    public Address addAddress(Long userId, AddressDto addressDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        Address address = new Address();
        address.setUser(user);
        address.setStreet(addressDto.getStreet());
        address.setCity(addressDto.getCity());
        address.setState(addressDto.getState());
        address.setZipCode(addressDto.getZipCode());
        address.setCountry(addressDto.getCountry());
        address.setIsDefault(addressDto.getIsDefault());

        if (addressDto.getIsDefault()) {
            // Set all other addresses as non-default
            addressRepository.findByUserIdAndIsDefault(userId, true)
                    .forEach(a -> {
                        a.setIsDefault(false);
                        addressRepository.save(a);
                    });
        }

        return addressRepository.save(address);
    }

    public List<Address> getUserAddresses(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    public Optional<Address> getDefaultAddress(Long userId) {
        return addressRepository.findByUserIdAndIsDefault(userId, true).stream().findFirst();
    }

    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new RuntimeException("Address not found or doesn't belong to user"));

        addressRepository.delete(address);
    }
}