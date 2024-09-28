import React from "react";
import axios from 'axios';
import { useState } from "react";
import { useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const DashBoard = () => {

    const [chartData, setChartData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    enquiries: 0,
    feesCollection: 0,
    enrollments: 0,
    assignmentSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetching Student Registration Data for Bar Chart
  useEffect(() => {
    axios.get('https://strapiqa.sparts.app/api/students?filters[users][id]=3')
      .then(response => {
        const students = response.data.data;
        const monthlyRegistrations = students.reduce((acc, student) => {
          const month = new Date(student.attributes.createdAt).toLocaleString('default', { month: 'short' });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});
        const formattedData = Object.keys(monthlyRegistrations).map(month => ({
          month,
          count: monthlyRegistrations[month],
        }));
        setChartData(formattedData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Fetching Data for Summary Count Section
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enquiries, fees, enrollments, assignments] = await Promise.all([
          axios.get('https://strapiqa.sparts.app/api/enquiries'),
          axios.get('https://strapiqa.sparts.app/api/fees-collection'),
          axios.get('https://strapiqa.sparts.app/api/students-enrolement-data'),
          axios.get('https://strapiqa.sparts.app/api/assignment-submissions'),
        ]);

        setSummaryData({
          enquiries: enquiries.data.data.length,
          feesCollection: fees.data.data.length,
          enrollments: enrollments.data.data.length,
          assignmentSubmissions: assignments.data.data.length,
        });
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);


    return (
        <div className="container mx-auto p-6">
          {/* Bar Chart Section */}
          <h2 className="text-2xl font-bold mb-4">Monthly Student Registrations</h2>
          <div className="bg-white shadow-md rounded-lg p-4 mb-6">
            <BarChart width={600} height={300} data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </div>
    
          {/* Summary Count Section */}
          <h2 className="text-2xl font-bold mb-4">Summary Count</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard title="Enquiries" count={summaryData.enquiries} />
            <SummaryCard title="Fees Collection" count={summaryData.feesCollection} />
            <SummaryCard title="Enrollments" count={summaryData.enrollments} />
            <SummaryCard title="Assignment Submissions" count={summaryData.assignmentSubmissions} />
          </div>
        </div>
      );
};
    
    // SummaryCard Component for Reusability
    const SummaryCard = ({ title, count }) => (
      <div className="bg-white shadow-md rounded-lg p-4 text-center">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{count}</p>
      </div>
    );
    

export default DashBoard;