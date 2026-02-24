-- Tables for Test Assignment and Tracking System

CREATE TABLE IF NOT EXISTS patient_test_assignations (
    id SERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    test_id BIGINT NOT NULL,
    soignant_id BIGINT NOT NULL,
    accompagnant_id BIGINT,
    date_assignation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_limite DATE,
    instructions TEXT,
    status VARCHAR(50) DEFAULT 'ASSIGNED',
    CONSTRAINT fk_assign_test FOREIGN KEY (test_id) REFERENCES cognitive_tests(id)
);

CREATE TABLE IF NOT EXISTS test_results (
    id SERIAL PRIMARY KEY,
    assign_id BIGINT UNIQUE NOT NULL,
    accompagnant_id BIGINT,
    date_debut TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_fin TIMESTAMP,
    score_total INTEGER DEFAULT 0,
    score_max INTEGER DEFAULT 0,
    observations TEXT,
    CONSTRAINT fk_result_assign FOREIGN KEY (assign_id) REFERENCES patient_test_assignations(id)
);

CREATE TABLE IF NOT EXISTS test_answers (
    id SERIAL PRIMARY KEY,
    result_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    answer_text TEXT,
    points_obtained INTEGER DEFAULT 0,
    is_correct BOOLEAN,
    CONSTRAINT fk_answer_result FOREIGN KEY (result_id) REFERENCES test_results(id),
    CONSTRAINT fk_answer_question FOREIGN KEY (question_id) REFERENCES test_questions(id)
);
