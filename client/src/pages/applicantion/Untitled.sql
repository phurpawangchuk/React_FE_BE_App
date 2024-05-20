
select * from employee e 
join department d ON d.id=e.dept_id
WHERE e.salary between 5000 and 38000;

e.dept_id in(2,3,4)

select * from employee_temp e 
join department t ON t.dept_name=e.dept_name

select * from 
student_course sc
JOIN student s ON s.studentId=sc.studentId
JOIN course c ON c.courseId = sc.courseId


WHERE e.salary>2000 and e.dept_name='I';

select * from employee WHERE salary>2000;

and e.dept_name='IT';

insert into employee values(53177,'Phurpa',15,'Asst. Prof',null,3);

select * from employee where emp_id=7309;
update employee set designation='Manager' where emp_id=7309;

SELECT @@transaction_isolation;

SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;

----53167---
with averageSalary as (
        select dept_id,avg(salary) as avgSal
        from employee
        group by dept_id
    )
    select * 
    from employee e
    join averageSalary a ON e.dept_id=a.dept_id
    where e.salary > a.avgSal;

-----
with averageSalary as (
        select avg(salary) as avgSal
        from employee
    )
    select * 
    from employee e
    where e.salary > (select avgSal from averageSalary)
---
select * 
from employee
where salary > (
    select avg(salary)
    from employee
    group by dept_id
)

---- 56096 --
select *
from employee
where salary > (
            select avg(salary)
            from employee    
        );

---56097--
select * from 
employee 
where dept_id IN 
(
    select dept_id
    from employee
    where salary > 
        (
            select avg(salary) 
            from employee 
        )
)
--
------- emp details whose salary is highest in each dept---
select *
from employee
where salary IN(
        select max(salary)
        from employee
        group by dept_name
    )

------- emp details whose salary is second highest---
select *
from employee
where salary IN (
        select max(salary)
        from employee
        where salary IN (
            select salary
            from employee
            where salary < (
                select max(salary)
                from employee
            )
        )
    )
--OR
WITH highest_salary AS (
          select max(salary) as maxsal
          from employee
        ),
        second_higest_salary AS (
            select max(salary) as secmax
            from employee e
            JOIN highest_salary hs ON e.salary < hs.maxsal
        )
        select *
        from employee e
        join second_higest_salary s ON s.secmax=e.salary

------- emp details whose salary is second highest in each dept---
    WITH highest_salary AS (
          select dept_name,max(salary) as maxsal
          from employee
          group by dept_name
        ),
        second_higest_salary AS (
            select e.dept_name,max(salary) as secmax
            from employee e
            JOIN highest_salary hs ON e.salary < hs.maxsal
            and e.dept_name = hs.dept_name
            group by e.dept_name
        )
        select *
        from employee e
        join second_higest_salary s ON s.secmax=e.salary
        and e.dept_name = s.dept_name;
-- -------------------------------------------------------
--------------------------------------------------------------
--------------------------------------------------------------


-- 41) Retrieve the list of courses with the lowest average grade.
with courselist as
         (
             select courseId,courseName
             from course
         ),
     lowestGrade as (
         select sc.courseId, min(stdcourse_numeric_grade) as lGrade
         from student_course sc
         group by sc.courseId
     ),
     averageGrade as (
         select sc.courseId, avg(stdcourse_numeric_grade) as aGrade
         from student_course sc
         group by sc.courseId
     )
select *
from courselist cl
         join lowestGrade lg ON lg.courseId=cl.courseId
         join averageGrade av ON av.courseId=cl.courseId and lg.lGrade < av.aGrade

--------------------------------------------------------------

    WITH totalSales (store_id,total_sales_by_store) AS
    (
        select store_id, sum(price) as total_sales_by_store
        from sales
        group by store_id
    ),
     avgSale (avg_sale) AS
         (
             select avg(total_sales_by_store) as avg_sale
             from totalSales
         )
SELECT store_name,product_name,s.store_id,total_sales_by_store,avg_sale
FROM sales s
         JOIN totalSales ts ON ts.store_id=s.store_id
         JOIN avgSale av ON ts.total_sales_by_store > av.avg_sale
--------------------------------------------------------------
----salary more than avg salary
WITH avgSalary AS (
    SELECT avg(salary) as avgsal
    from employee
)
select e.*, ag.avgsal as averageSalary
from employee e
join avgSalary ag ON e.salary>ag.avgsal

------------Second Max salary--------
WITH higestSalary(msal) AS (
    select max(salary) as msal
    from employee
)
select max(salary)
from employee e
join higestSalary hs on e.salary < hs.msal
--------------------------------------------------------------
--Remove Duplicate record----
delete
from product_log
where id not IN(
    select min(id)
    from product_log
    group by name,price,color
);
--------------------------------------------------------------
--select emp details whose salary is greater than avg of each dept
select emp_id,name,salary,t1.dept_name
from employee t1
where t1.salary > (
        select avg(salary) as asal
        from employee t2
        where t1.dept_name=t2.dept_name
        group by dept_name
    )
--OR
select emp_id,name,salary,t1.dept_name,t2.asal
from employee t1
join (select dept_name,avg(salary) as asal
      from employee
      group by dept_name) t2
      ON t1.dept_name = t2.dept_name and t1.salary > t2.asal

--------------------------------------------------------------
--Find the emp who earns the highest salary in each dept
with dept_emp_with_max_salary as (
        select dept_name,max(salary) as maxSalary
        from employee
        group by dept_name
    )
    select emp_id,name,salary,e.dept_name,maxSalary
    from employee e
    join dept_emp_with_max_salary e1
    ON e.salary = e1.maxSalary and e.dept_name=e1.dept_name
--OR
    select *
    from employee
    where (dept_name, salary) IN
        (
            select dept_name, max(salary)
            from employee
            group by dept_name
        )
--------------------------------------------------------------

--------------------------------------------------------------
--------------------------------------------------------------
---Extract Employee details with Min Max for each dept
WITH minSalary AS (
        select dept_name,min(salary) as minSal
        from employee
        group by dept_name
    ),
    maxSalary AS (
        select dept_name,max(salary) as maxSal
        from employee
        group by dept_name
    )
    select emp_id,name,mi.dept_name, salary,mi.minSal, mx.maxSal
    from employee e
    join minSalary mi on mi.dept_name=e.dept_name
    join maxSalary mx on mx.dept_name=e.dept_name;


-- 75) Retrieve the list of students who have not enrolled in any courses.
WITH student_not_enrolled AS (
            select studentName,studentId
            from student
            where studentId not in (
                select studentId
                from student_course
            )
        )
        select *
        from student_not_enrolled sn On sn.studentId=s.studentId

-- 77) Retrieve the list of assignments that have the lowest average grade.
WITH assignemnt_with_avg_grade AS
    (
        select assignmentId, avg(assignment_numeric_grade) as avgGrade
        from student_assignment
        where assignment_graded_date is not null
        group by assignmentId
    )
    select sa.assignmentId,min(avgGrade) as lowestAvgGrade
        from student_assignment sa
        join assignemnt_with_avg_grade aw ON aw.assignmentId=sa.assignmentId
        group by aw.assignmentId

-- 79) Retrieve the list of courses where the average grade of all students is above 80.
WITH student_avggrade_above_eighty AS
        (
            select studentId,avg(stdcourse_numeric_grade) as avgGrade
            from student_course
            group by studentId
            having avgGrade >80
        )
        select s.studentName,c.courseName,sg.avgGrade
        from student_avggrade_above_eighty sg
        join student_course sc on sc.studentId=sg.studentId
        join course c on c.courseId=sc.courseId
        join student s on s.studentId=sc.studentId


-- 80) Retrieve the list of students who have the highest grade in each course.
WITH course_with_highest_grade(courseId,highestGrade) AS
    (
        select courseId,max(stdcourse_numeric_grade) as highestGrade
        from student_course
        group by courseId
    ),
    studentcourse_with_highest_grade(studentId,courseId) AS (
        select sc.studentId,sc.courseId
        from course_with_highest_grade cw
        join student_course sc ON sc.courseId=cw.courseId and sc.stdcourse_numeric_grade=cw.highestGrade
    )
    select studentName,sc.courseId,cw.highestGrade
    from student s
    join studentcourse_with_highest_grade sc ON sc.studentId=s.studentId
    join course_with_highest_grade cw ON cw.courseId = sc.courseId;
--OR
WITH max_course_grade AS (
        select sc.courseId, max(stdcourse_numeric_grade) as maxGrade
        from student_course sc
             join student s on s.studentId = sc.studentId
             join course c on c.courseId = sc.courseId
        group by sc.courseId
    )
    select studentName,sc.courseId,mx.maxGrade
    from student_course sc
    join student s on s.studentId = sc.studentId
    join max_course_grade mx on mx.courseId=sc.courseId and mx.maxGrade=sc.stdcourse_numeric_grade

--------------------------------------------------------------

--------------------------------------------------------------
--------------------------------------------------------------

--------------------------------------------------------------
--------------------------------------------------------------