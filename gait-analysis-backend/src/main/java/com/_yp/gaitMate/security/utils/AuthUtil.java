package com._yp.gaitMate.security.utils;

import com._yp.gaitMate.exception.ResourceNotFoundException;
import com._yp.gaitMate.security.dto.UserInfoResponse;
import com._yp.gaitMate.security.mapper.Mapper;
import com._yp.gaitMate.security.model.User;
import com._yp.gaitMate.security.model.UserDetailsImpl;
import com._yp.gaitMate.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import com._yp.gaitMate.model.Clinic;
import com._yp.gaitMate.repository.ClinicRepository;
import com._yp.gaitMate.repository.DoctorRepository;
import com._yp.gaitMate.model.Doctor;
@Component
@RequiredArgsConstructor
public class AuthUtil {
    private static final Logger log = LoggerFactory.getLogger(AuthUtil.class);
    private final UserRepository userRepository;
    private final Mapper mapper;

    private final ClinicRepository clinicRepository;
    private final DoctorRepository doctorRepository;


    public String loggedInEmail(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//        User user = userRepository.findByUsername(authentication.getName())
//                .orElseThrow(()-> new UsernameNotFoundException("User not Found"));
//
//        return user.getEmail();

        UserDetailsImpl userDetails = (UserDetailsImpl) (authentication.getPrincipal());
        return userDetails.getEmail();
    }

    public Long loggedInUserId(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//        User user = userRepository.findByUsername(authentication.getName())
//                .orElseThrow(()-> new UsernameNotFoundException("User not Found"));

//        return user.getUserId();

        UserDetailsImpl userDetails = (UserDetailsImpl) (authentication.getPrincipal());
        return userDetails.getId();
    }

    public String loggedInUsername(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//        User user = userRepository.findByUsername(authentication.getName())
//                .orElseThrow(()-> new UsernameNotFoundException("User not Found"));

//        return user.getUserId();

        UserDetailsImpl userDetails = (UserDetailsImpl) (authentication.getPrincipal());
        return userDetails.getUsername();
    }

    public User loggedInUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(()-> new UsernameNotFoundException("User not Found"));

        return user;
    }

    public UserInfoResponse loggedInUserResponse(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        log.info("AuthUtil.java: principal - {}", authentication.getPrincipal().toString());

//        User user = userRepository.findByUsername(authentication.getName())
//                .orElseThrow(()-> new UsernameNotFoundException("User not Found"));

        return mapper.toUserInfoResponse((UserDetailsImpl) authentication.getPrincipal());
    }



    public Clinic getLoggedInClinic() {
        // Get currently logged-in clinic's user ID
        Long clinicUserId = loggedInUserId();

        // find the clinic of the logged-in user
        Clinic clinic = clinicRepository.findByUser_UserId(clinicUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Clinic", "userId", clinicUserId));

        return clinic;
    }


    public Doctor getLoggedInDoctor() {
        // Get currently logged-in doctor's user ID
        Long doctorUserId = loggedInUserId();

        // find the doctor attached to the logged-in user
        Doctor doctor = doctorRepository.findByUser_UserId(doctorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "userId", doctorUserId));

        return doctor;
    }
}
