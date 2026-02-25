package com.med.cognitive.repository;

import com.med.cognitive.entity.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    Optional<TestResult> findByAssignationId(Long assignId);

    java.util.List<TestResult> findByPatientIdOrderByTestDateDesc(String patientId);
}
