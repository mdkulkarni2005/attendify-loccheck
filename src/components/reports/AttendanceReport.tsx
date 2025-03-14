import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Calendar, Download, Mail, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Demo data for class attendance records
const MOCK_CLASS_ATTENDANCE = Array.from({ length: 30 }).map((_, i) => {
  const isPresent = Math.random() > 0.2;
  const isLate = !isPresent && Math.random() > 0.7;
  const isProxy = !isPresent && !isLate && Math.random() > 0.8;
  const status = isPresent ? 'present' : isLate ? 'late' : isProxy ? 'proxy' : 'absent';
  
  return {
    id: `record-${i + 1}`,
    studentName: `Student ${i + 1}`,
    rollNumber: `S00${i + 1}`,
    date: format(new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000), 'yyyy-MM-dd'),
    class: 'CS101',
    status,
    percentage: Math.floor(Math.random() * 40) + 60,
    department: 'Computer Science',
    year: '2023'
  };
});

// COLORS
const COLORS = {
  present: '#4ade80',
  absent: '#f87171',
  late: '#facc15',
  proxy: '#fb923c',
  low: '#ef4444',
  medium: '#f59e0b',
  high: '#22c55e',
};

const AttendanceReport = () => {
  const { toast } = useToast();
  const [records, setRecords] = useState(MOCK_CLASS_ATTENDANCE);
  const [filteredRecords, setFilteredRecords] = useState(records);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const reportRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Filter records based on selected filters
    let filtered = records;
    
    if (selectedClass) {
      filtered = filtered.filter(record => record.class === selectedClass);
    }
    
    if (selectedMonth) {
      filtered = filtered.filter(record => record.date.startsWith(selectedMonth));
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(record => 
        record.studentName.toLowerCase().includes(term) ||
        record.rollNumber.toLowerCase().includes(term)
      );
    }
    
    setFilteredRecords(filtered);
  }, [records, selectedClass, selectedMonth, searchTerm]);
  
  // Group data for charts
  const getAttendanceStats = () => {
    const totalRecords = filteredRecords.length;
    const presentCount = filteredRecords.filter(r => r.status === 'present').length;
    const absentCount = filteredRecords.filter(r => r.status === 'absent').length;
    const lateCount = filteredRecords.filter(r => r.status === 'late').length;
    const proxyCount = filteredRecords.filter(r => r.status === 'proxy').length;
    
    return [
      { name: 'Present', value: presentCount, fill: COLORS.present },
      { name: 'Absent', value: absentCount, fill: COLORS.absent },
      { name: 'Late', value: lateCount, fill: COLORS.late },
      { name: 'Proxy', value: proxyCount, fill: COLORS.proxy },
    ];
  };
  
  const getStudentAttendanceData = () => {
    // Group by student and calculate percentages
    const studentMap = new Map();
    
    filteredRecords.forEach(record => {
      if (!studentMap.has(record.rollNumber)) {
        studentMap.set(record.rollNumber, {
          rollNumber: record.rollNumber,
          studentName: record.studentName,
          totalClasses: 0,
          presentCount: 0,
          absentCount: 0,
          lateCount: 0,
          proxyCount: 0,
        });
      }
      
      const student = studentMap.get(record.rollNumber);
      student.totalClasses++;
      
      if (record.status === 'present') student.presentCount++;
      else if (record.status === 'absent') student.absentCount++;
      else if (record.status === 'late') student.lateCount++;
      else if (record.status === 'proxy') student.proxyCount++;
    });
    
    // Calculate percentages and convert to array
    return Array.from(studentMap.values()).map(student => ({
      ...student,
      attendancePercentage: Math.round((student.presentCount / student.totalClasses) * 100),
    }));
  };
  
  // Email functions
  const handleEmailReports = () => {
    toast({
      title: "Sending Reports",
      description: "Attendance reports are being sent to all students...",
    });
    
    // In a real app, this would make an API call
    setTimeout(() => {
      toast({
        title: "Reports Sent",
        description: "Attendance reports have been emailed to all students.",
      });
    }, 2000);
  };
  
  const handleEmailLowAttendance = () => {
    const lowAttendanceCount = getStudentAttendanceData()
      .filter(student => student.attendancePercentage < 75)
      .length;
    
    toast({
      title: "Sending Low Attendance Alerts",
      description: `Sending alerts to ${lowAttendanceCount} students with less than 75% attendance...`,
    });
    
    // In a real app, this would make an API call
    setTimeout(() => {
      toast({
        title: "Alerts Sent",
        description: `${lowAttendanceCount} students have been notified about their low attendance.`,
      });
    }, 2000);
  };
  
  // Export functions
  const generateCSV = () => {
    const students = getStudentAttendanceData();
    const headers = ['Roll Number', 'Student Name', 'Total Classes', 'Present', 'Absent', 'Late', 'Proxy', 'Attendance %'];
    
    const rows = students.map(student => [
      student.rollNumber,
      student.studentName,
      student.totalClasses,
      student.presentCount,
      student.absentCount,
      student.lateCount,
      student.proxyCount,
      `${student.attendancePercentage}%`
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csvContent;
  };
  
  const handleExportCSV = () => {
    const csv = generateCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportPDF = () => {
    toast({
      title: "Exporting PDF",
      description: "Attendance report is being generated as PDF...",
    });
    
    // In a real app, this would generate a PDF file
    // For now, we'll just show a success message
    setTimeout(() => {
      toast({
        title: "PDF Exported",
        description: "Attendance report has been exported as PDF.",
      });
    }, 2000);
  };
  
  const handlePrintReport = () => {
    if (reportRef.current) {
      const printContents = reportRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      
      document.body.innerHTML = `
        <style>
          @media print {
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .low-attendance { background-color: #ffcccc; }
            h1, h2 { margin-bottom: 10px; }
          }
        </style>
        <h1>Attendance Report</h1>
        <h2>Date: ${new Date().toLocaleDateString()}</h2>
        ${printContents}
      `;
      
      window.print();
      document.body.innerHTML = originalContents;
    }
  };
  
  // Get the month names for the dropdown
  const months = [
    { value: '2023-01', label: 'January 2023' },
    { value: '2023-02', label: 'February 2023' },
    { value: '2023-03', label: 'March 2023' },
    { value: '2023-04', label: 'April 2023' },
    { value: '2023-05', label: 'May 2023' },
    { value: '2023-06', label: 'June 2023' },
    { value: '2023-07', label: 'July 2023' },
    { value: '2023-08', label: 'August 2023' },
    { value: '2023-09', label: 'September 2023' },
    { value: '2023-10', label: 'October 2023' },
    { value: '2023-11', label: 'November 2023' },
    { value: '2023-12', label: 'December 2023' },
  ];
  
  // Get list of classes for dropdown
  const classes = [
    { value: 'CS101', label: 'CS101 - Introduction to Computer Science' },
    { value: 'CS202', label: 'CS202 - Data Structures' },
    { value: 'MATH101', label: 'MATH101 - Calculus I' },
    { value: 'PHY101', label: 'PHY101 - Physics I' },
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Attendance Reports</CardTitle>
              <CardDescription>
                View and export attendance reports
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                CSV
              </Button>
              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button variant="outline" onClick={handlePrintReport}>
                <Download className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" onClick={handleEmailReports}>
                <Mail className="mr-2 h-4 w-4" />
                Email Reports
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input 
                placeholder="Search student name or roll number..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex-1 grid grid-cols-2 gap-2">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.value} value={cls.value}>{cls.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Months</SelectItem>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue="students">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="students">Student Attendance</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="low-attendance">Low Attendance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="students">
              <div ref={reportRef} className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="text-center">Total Classes</TableHead>
                      <TableHead className="text-center">Present</TableHead>
                      <TableHead className="text-center">Absent</TableHead>
                      <TableHead className="text-center">Late</TableHead>
                      <TableHead className="text-center">Proxy</TableHead>
                      <TableHead className="text-center">Attendance %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getStudentAttendanceData().map((student) => (
                      <TableRow key={student.rollNumber}>
                        <TableCell>{student.rollNumber}</TableCell>
                        <TableCell>{student.studentName}</TableCell>
                        <TableCell className="text-center">{student.totalClasses}</TableCell>
                        <TableCell className="text-center">{student.presentCount}</TableCell>
                        <TableCell className="text-center">{student.absentCount}</TableCell>
                        <TableCell className="text-center">{student.lateCount}</TableCell>
                        <TableCell className="text-center">{student.proxyCount}</TableCell>
                        <TableCell className={`text-center font-medium ${student.attendancePercentage < 75 ? 'text-red-500 bg-red-50' : ''}`}>
                          {student.attendancePercentage}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Overall Attendance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getAttendanceStats()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {getAttendanceStats().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} records`, 'Count']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Student Attendance Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: '<75%', count: getStudentAttendanceData().filter(s => s.attendancePercentage < 75).length, fill: COLORS.low },
                            { name: '75-85%', count: getStudentAttendanceData().filter(s => s.attendancePercentage >= 75 && s.attendancePercentage < 85).length, fill: COLORS.medium },
                            { name: '>85%', count: getStudentAttendanceData().filter(s => s.attendancePercentage >= 85).length, fill: COLORS.high },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value} students`, 'Count']} />
                          <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]}>
                            {[
                              <Cell key="cell-0" fill={COLORS.low} />,
                              <Cell key="cell-1" fill={COLORS.medium} />,
                              <Cell key="cell-2" fill={COLORS.high} />,
                            ]}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="low-attendance">
              <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center">
                  <AlertTriangle className="text-red-500 mr-2 h-5 w-5" />
                  <h3 className="font-medium">Students with Less Than 75% Attendance</h3>
                </div>
                <Button onClick={handleEmailLowAttendance}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Warning Emails
                </Button>
              </div>
              
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="text-center">Total Classes</TableHead>
                      <TableHead className="text-center">Present</TableHead>
                      <TableHead className="text-center">Absent</TableHead>
                      <TableHead className="text-center">Attendance %</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getStudentAttendanceData()
                      .filter(student => student.attendancePercentage < 75)
                      .map((student) => (
                        <TableRow key={student.rollNumber}>
                          <TableCell>{student.rollNumber}</TableCell>
                          <TableCell>{student.studentName}</TableCell>
                          <TableCell className="text-center">{student.totalClasses}</TableCell>
                          <TableCell className="text-center">{student.presentCount}</TableCell>
                          <TableCell className="text-center">{student.absentCount}</TableCell>
                          <TableCell className="text-center font-medium text-red-500">
                            {student.attendancePercentage}%
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="destructive">Warning</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              
              {getStudentAttendanceData().filter(student => student.attendancePercentage < 75).length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  <p>No students with low attendance found.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceReport;