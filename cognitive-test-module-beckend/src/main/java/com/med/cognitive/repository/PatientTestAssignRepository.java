package com.med.cognitive.repository;

import com.med.cognitive.entity.AssignStatus;
import com.med.cognitive.entity.PatientTestAssign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientTestAssignRepository extends JpaRepository<PatientTestAssign, Long> {
    List<PatientTestAssign> findBySoignantId(Long soignantId);

    List<PatientTestAssign> findByPatientId(Long patientId);

    List<PatientTestAssign> findByPatientIdIn(List<Long> patientIds);

    List<PatientTestAssign> findByAccompagnantId(Long accompagnantId);

    List<PatientTestAssign> findByAccompagnantIdAndStatus(Long accompagnantId, AssignStatus status);

    List<PatientTestAssign> findByTestId(Long testId);
}
