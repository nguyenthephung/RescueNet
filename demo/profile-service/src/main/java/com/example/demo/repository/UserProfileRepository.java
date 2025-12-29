package com.example.demo.repository;

import com.example.demo.model.ProfileUser;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface  UserProfileRepository extends Neo4jRepository<ProfileUser, String> {
    Optional<ProfileUser> findByusername(String username);
    List<ProfileUser> findAllByusernameLike(String username);
}
