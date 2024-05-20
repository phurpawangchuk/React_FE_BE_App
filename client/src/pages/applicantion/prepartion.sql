-- Section 1: Theory (15 points, 10 questions)
-- Answer directly, max 4 lines per answer.
-- Define Primary Key (PK).
-- What is a Foreign Key (FK) and its purpose?
-- Explain the concept of an Index in databases.
-- Describe the different types of JOINs in SQL.
-- What is an Isolation Level in databases?
-- What does the GROUP BY clause do in SQL?
-- When would you use the HAVING clause instead of WHERE?
-- What are Subqueries in SQL?
-- List the different types of SQL subqueries.
-- Explain the difference between INNER JOIN and OUTER JOIN.
-- Section 2: Table Creation and Data Insertion (15 points)
-- Create tables and insert data as per lab2 sample problem.
-- Create Tables:

-- Create the COLLEGE table with columns: CName, COffice, CPhone, Dean.
create table COLLEGE (
    CName varhcr
)
-- Create the DEPT table with columns: DName, DCode, DOffice, DPhone, Chair, CStartDate.
-- Create the COURSE table with columns: CoName, CCode, Level, Credits, CDesc.
-- Create the INSTRUCTOR table with columns: Id, IName, IOffice, IPhone, Rank, PrimaryDept.
-- Create the STUDENT table with columns: FName, MName, LName, Sid, Addr, Phone, Major, DoB.
-- Create the SECTION table with columns: SecId, SecNo, Sem, Year, CRoom, DaysTime, Course, Instructor.
-- Data Insertion:

-- Insert 3 records into the COLLEGE table.
-- Insert 3 records into the DEPT table.
-- Insert 3 records into the COURSE table.
-- Insert 3 records into the INSTRUCTOR table.
-- Insert 3 records into the STUDENT table.
-- Insert 3 records into the SECTION table.
-- Section 3: SQL Queries (15 points, 10-11 questions)
-- Focus on GROUP BY, HAVING, Joins, and Subqueries.
-- Query to list all departments with more than 10 courses offered.
-- Find the average grade of students per department.
-- Retrieve the list of courses along with the name of the instructor teaching each course.
-- Find all students who have taken a course in the 'Computer Science' department.
-- List the names of instructors who are teaching more than 3 courses.
-- Get the total number of students enrolled in each section.
-- Find the departments that have at least one student with a GPA higher than 3.5.
-- Retrieve the list of students who have not yet declared a major.
-- Find the names of students who are enrolled in sections taught by 'Dr. Smith'.
-- List the sections along with the total number of students enrolled, grouped by course and semester.
-- Get the details of courses which have prerequisites (use a subquery).
-- Section 4: Normalization (15 points)
-- Normalize a given table up to 3NF, explaining the violations and showing the updated table structure.
-- Given Table:

-- diff
-- Copy code
-- STUDENT_COURSE
-- ---------------
-- StudentId
-- StudentName
-- CourseId
-- CourseName
-- InstructorName
-- InstructorOffice
-- Grade
-- Normalization:

-- 1NF: Ensure all entries are atomic.
-- 2NF: Remove partial dependencies (StudentId, CourseId).
-- 3NF: Remove transitive dependencies (InstructorName, InstructorOffice).
-- Explanation:

-- Identify violations of NF rules and show the updated table structures for 1NF, 2NF, and 3NF.

-- -- Section 3: SQL Queries (15 points, 10-11 questions)
-- -- Focus on GROUP BY, HAVING, Joins, and Subqueries.

-- -- Query to list all departments with more than 10 courses offered.

    WITH courses AS (
        select courseId,count(*) as courseOffered
        from course
        group by courseId
    )
    select *
    from department d
    join courses c on c.courseId=d.courseId
    where c.courseOffered  >10

    /* Query 1 */
WITH course_count AS (
    SELECT
        DCode,
        COUNT(*) AS dep_course_count
    FROM
        course
    GROUP BY
        DCode
)
SELECT
    d.DName,
    d.DCode,
    cc.dep_course_count
FROM
    course_count cc
    JOIN department d ON d.DCode = cc.DCode
WHERE
    cc.dep_course_count > 10;

/* Query 2 */
SELECT
    s.DCode,
    AVG(ss.Grade)
FROM
    student_section ss
    JOIN student s ON s.SId = ss.SId
GROUP BY
    s.DCode;

/* Query 3 */
SELECT
    DISTINCT c.CoName,
    c.CCode,
    i.IName
FROM
    section s
    JOIN instructor i ON i.Id = s.Instructor
    JOIN course c ON c.CCode = s.Course;

/* Query 4 */
SELECT
    s.SId,
    s.SName,
    c.CoName
FROM
    student_section ss
    JOIN student s ON s.SId = ss.SId
    JOIN section sec ON sec.SecId = ss.SecId
    JOIN course c ON sec.Course = c.CCode
    JOIN department d ON c.DCode = d.DCode
WHERE
    d.DName = 'Computer Science';

/* Query 5 */
SELECT
    i.IName,
    COUNT(sec.Course)
FROM
    section sec
    JOIN instructor i ON i.Id = sec.instructor
GROUP BY
    i.IName
HAVING
    COUNT(sec.Course) > 3;

/* Query 6 */
SELECT
    ss.SecId,
    COUNT(ss.SId)
FROM
    student_section
GROUP BY
    ss.SecID;

/* Query 7 */
--  Find the departments that have at least one student with a GPA higher than 3.5.
WITH student_avg AS (
    SELECT
        ss.SId,
        AVG(ss.Grade) as student_avg_grade
    FROM
        student_section ss
    HAVING
        student_avg_grade > 3.5
),
department_count AS (
    SELECT
        DISTINCT d.DName,
        d.DCode,
        COUNT(*) as student_count
    FROM
        student_avg sa
        JOIN student s ON s.SId = sa.SId
        JOIN department d ON d.DCode = s.DCode
)
SELECT
    dc.DName,
    dc.DCode,
    dc.student_count
FROM
    department_count dc
WHERE
    dc.student_count >= 1;

/* Query 8 */
SELECT
    *
FROM
    student
WHERE
    Major IS NULL;

/* Query 9 */
SELECT
    ss.SId s.SName
FROM
    student_section ss
    JOIN section sec ON sec.SecId = ss.SecId
    JOIN student s ON s.SId = ss.SId
    JOIN instructor i ON i.Id = sec.Instructor
WHERE
    i.IName = 'Dr. Smith';

/* Query 10 */
SELECT
    sec.Course,
    sec.Sem,
    COUNT(ss.SId)
FROM
    student_section ss
    JOIN section sec ON sec.SecId = ss.SecId
GROUP BY
    sec.Course,
    sec.Sem;

/* Query 11 */
SELECT
    c.CoName,
    c.CCode
FROM
    course c
WHERE
    c.CCode IN (
        SELECT
            CCode
        FROM
            course_prerequisite
    );

-- -- Find the average grade of students per department.
--     select avg(grade)
--     from student
--     group by deptId


-- -- Retrieve the list of courses along with the name of the instructor teaching each course.
--    select * 
--    from course c
--    join instrctor i on i.instructorId=c.instrctorId

-- -- Find all students who have taken a course in the 'Computer Science' department.

-- -- List the names of instructors who are teaching more than 3 courses.

-- -- Get the total number of students enrolled in each section.

-- -- Find the departments that have at least one student with a GPA higher than 3.5.

-- -- Retrieve the list of students who have not yet declared a major.

-- -- Find the names of students who are enrolled in sections taught by 'Dr. Smith'.

-- List the sections along with the total number of students enrolled, grouped by course and semester.

-- Get the details of courses which have prerequisites (use a subquery).

-- Section 4: Normalization (15 points)
-- Normalize a given table up to 3NF, explaining the violations and showing the updated table structure.
-- Given Table: