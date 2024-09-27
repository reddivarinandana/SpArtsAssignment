import React from "react";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2"; 
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StudentList = () => {

    const [students, setStudents] = useState([]);
    const [enquiriesCount, setEnquiriesCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [followUpEnquiriesCount, setFollowUpEnquiriesCount] = useState(0);
    const [enrollmentApprovalCount, setEnrollmentApprovalCount] = useState(0);
    const [feeRemainderCount, setFeeRemainderCount] = useState(0);
    const [upcomingFeeAlertsCount, setUpcomingFeeAlertsCount] = useState(0);
    const [assignmentSubmissionCount, setAssignmentSubmissionCount] = useState(0);
    const [promoteNewCertificateCount, setPromoteNewCertificateCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchStudents = async () => {
        try {
            const response = await fetch('https://strapiqa.sparts.app/api/students');
        //     if (!response.ok) {
        //         throw new Error("Response Failed");
        //     }
        //     const data = await response.json();
        //     const studentsData = data.data; 
        //     setStudents(studentsData);
        //     setEnquiriesCount(studentsData.length); 
        // } catch (error) {
        //     console.error("Error fetching data:", error);
        // } finally {
        //     setLoading(false);
        // }
        const data = await response.json();
        console.log("API Response:", data);

        if (data && data.data) {
            setStudents(data.data);
            // Example filtering logic based on the available attributes
            const enquiries = data.data.filter(item => item.attributes.createdAt && item.attributes.createdAt > '2024-01-01'); // Sample filter for enquiries
            const followUpEnquiries = data.data.filter(item => item.attributes.updatedAt && item.attributes.updatedAt > '2024-01-01'); // Sample filter for follow-up
            const enrollmentApprovals = data.data.filter(item => !item.attributes.grade); // Assuming no grade means approval pending
            const feeRemainders = data.data.filter(item => item.attributes.city === 'Bangalore'); // Example filter, replace with real condition
            const upcomingFeeAlerts = data.data.filter(item => new Date(item.attributes.dob).getFullYear() === 2011); // Sample for alert based on DOB
            const assignmentSubmissions = data.data.filter(item => item.attributes.school === null); // Replace with real condition
            const promoteNewCertificates = data.data.filter(item => item.attributes.bloodGroup === null); // Example condition

            // Update the state with the counts
            setEnquiriesCount(enquiries.length);
            setFollowUpEnquiriesCount(followUpEnquiries.length);
            setEnrollmentApprovalCount(enrollmentApprovals.length);
            setFeeRemainderCount(feeRemainders.length);
            setUpcomingFeeAlertsCount(upcomingFeeAlerts.length);
            setAssignmentSubmissionCount(assignmentSubmissions.length);
            setPromoteNewCertificateCount(promoteNewCertificates.length);
            setLoading(false);
        } else {
            console.error("Data not exist", data);
        }

        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchStudents();
    }, []);

    const getMonthlyNewStudentsData = () => {
        const monthCount = Array(12).fill(0); // For each month in the year
        students.forEach(student => {
            const createdAt = new Date(student.attributes.createdAt);
            const month = createdAt.getMonth(); // 0-indexed month
            monthCount[month] += 1; // Increment count for that month
        });
        return monthCount;
    };

    const filteredStudents = students.filter(student =>
        `${student.attributes.firstName} ${student.attributes.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );


    const chartData = {
        labels: filteredStudents.map(student => `${student.attributes.firstName} ${student.attributes.lastName}`),
        labels: [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
        datasets: [
            {
                label: 'New Students',
                data: getMonthlyNewStudentsData(),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }
        ]
    };

    // if (loading) return <div>Loading...</div>;


    return (
        <div className="flex">
            <div className="h-[880px] w-[90px] bg-[#002F86] flex flex-col items-center ">
                <img className="w-[30px] mt-10" src="/allimage.png" alt="" />
                <img className="w-[30px] mt-7" src="/allimage.png" alt="" />
                <img className="w-[30px] mt-7" src="/allimage.png" alt="" />
                <img className="w-[30px] mt-7" src="/allimage.png" alt="" />
                <img className="w-[30px] mt-7" src="/allimage.png" alt="" />
                <img className="w-[30px] mt-7" src="/allimage.png" alt="" />
                <img className="w-[30px] mt-7" src="/allimage.png" alt="" />
                <img className="w-[30px] mt-7" src="/allimage.png" alt="" />
                <img className="w-[30px] mt-7" src="/allimage.png" alt="" />
            </div>

            <div className="p-4 flex flex-col items-center space-y-4 width-full flex-1">
                <div className="flex items-center space-y-4" >
                    <img
                        className="w-[170px] h-[53px] top-[12px] absolute left-[101px]"
                        src="/sparts.png"
                        alt="SpArts"
                    />

                     <input
                        type="text"
                        placeholder="Search Students by Name"
                        className="border border-gray-300 rounded-full px-14 py-1 w-full max-w-[300px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <img
                        className="w-[40px] h-[39.37px] top-[10px] absolute left-[1350px] rounded-[360px]"
                        src="/image.jpg"
                        alt="Image 1"
                    />
                </div>
                <hr/>

                <div className="flex flex-row items-center space-y-4 w-full  ">
                    <div className="text-left">
                        <p className="weight-[400] mb-2 -mt-12">My Profile</p>
                        <p className="font-bold mb-2">Mayur Francis <span className="block">Borsaikia</span></p>
                        <p className="text-[#877A7A] mb-4">Academy Owner, Horizon Champions Club cj@example.com</p>
                        <p className="text-[#1C65ED]">Settings</p>
                        <p className="text-[#1C65ED]">My Team</p>
                        <p className="text-[#1C65ED]">Academy Calender</p>
                    </div>
                    <div className="w-[761px]">
                        <p className="flex flex-col  space-y-2 -mt-12 text-left">Quick Actions</p>
                            <button className="bg-[#F46D21] text-white text-center py-2 px-4 rounded -ml-16 ">
                                Send Enrollment Form
                            </button>
                            <button className="bg-[#F46D21] text-white text-center py-2 px-4 rounded ml-4">
                                Add Student
                            </button>
                            <button className="bg-[#F46D21] text-white text-center py-2 px-4 rounded ml-4">
                                Collect Fees
                            </button>
                        <div>
                            <p className="text-left mt-2">MONTH-ON-MONTH GROWTH</p>
                        <div className="w-full max-w-2xl mt-4">
                            <Bar data={chartData} options={{ responsive: true }} />
                        </div>
                        </div>
                    </div>
                    <div>
                    <div className="border border-gray-300 rounded-lg p-4 mt-4 w-full max-w-md text-left">
                        <div className="mb-4">
                            <p className="text-m border border-gray-300 inline-block p-1">ACTIVE STUDENTS</p>
                            <p className="text-m border border-gray-300 inline-block">5000</p>
                        </div>
                        <h2 className="text-lg font-semibold text-left">To Do List</h2>
                        <ul className="list-disc pl-5">
                            <li className="border border-gray-300 inline-block p-1">Follow-up {followUpEnquiriesCount} Enquiries</li>
                            <li className="border border-gray-300 inline-block p-1">You have {enrollmentApprovalCount} New Enrollment Approval Awaiting</li>
                            <li className="border border-gray-300 inline-block p-1">Send Fee Remainders to {feeRemainderCount} students</li>
                            <li className="border border-gray-300 inline-block p-1">Send Upcoming Fee Alerts to {upcomingFeeAlertsCount} Students</li>
                            <li className="border border-gray-300 inline-block p-1">You have {assignmentSubmissionCount} new Assignment Submission</li>
                            <li className="border border-gray-300 inline-block p-1">Promote {promoteNewCertificateCount} New students to Certification levels</li>
                        </ul>
                        <div className="mt-4 text-left">
                            <p>Increase your Student Engagement</p>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentList;
