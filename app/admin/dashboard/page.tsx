"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FolderOpen, Award, Code, MessageSquare, ExternalLink, Briefcase, GraduationCap, Eye, Mail } from "lucide-react"
import { AdminSidebar } from '@/components/AdminSidebar'
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { TopNavbar } from "@/components/TopNavbar";
import React from "react"; // Added missing import
import { useRef } from 'react';

// Define Project type
interface Project {
  _id?: string;
  id?: string | number;
  title: string;
  description: string;
  techStack: string[];
  date: string;
  image?: string;
  link?: string;
}

const statsData = [
  { title: "Total Projects", value: "12", icon: FolderOpen, change: "+2 this month" },
  { title: "Certificates", value: "8", icon: Award, change: "+1 this month" },
  { title: "Skills", value: "24", icon: Code, change: "+3 this month" },
  { title: "Messages", value: "47", icon: MessageSquare, change: "+12 this week" },
]

const recentActivity = [
  { date: "2024-01-15", event: "Added new project: E-commerce Platform" },
  { date: "2024-01-14", event: "Updated React certification" },
  { date: "2024-01-13", event: "New message from client" },
  { date: "2024-01-12", event: "Added TypeScript skill" },
  { date: "2024-01-11", event: "Updated timeline entry" },
]

export default function DashboardOverview() {
  const [activeSection, setActiveSection] = useState('projects')

  // Dynamic stats state
  const [stats, setStats] = useState({
    projects: 0,
    certificates: 0,
    skills: 0,
    messages: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStatsAndActivity() {
      try {
        // Fetch all in parallel
        const [projectsRes, certsRes, skillsRes, messagesRes, achievementsRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/certificates'),
          fetch('/api/skills'),
          fetch('/api/contact'),
          fetch('/api/achievements'),
        ]);
        const [projects, certificates, skills, messages, achievements] = await Promise.all([
          projectsRes.json(),
          certsRes.json(),
          skillsRes.json(),
          messagesRes.json(),
          achievementsRes.json(),
        ]);
        setStats({
          projects: Array.isArray(projects) ? projects.length : (projects.projects?.length || 0),
          certificates: Array.isArray(certificates) ? certificates.length : (certificates.certificates?.length || 0),
          skills: Array.isArray(skills) ? skills.length : (skills.skills?.length || 0),
          messages: Array.isArray(messages) ? messages.length : (messages.messages?.length || 0),
        });
        // Build recent activity from latest items
        const activities: any[] = [];
        // Projects
        (Array.isArray(projects) ? projects : projects.projects || []).slice(0, 3).forEach((p: any) => {
          activities.push({ date: p.createdAt?.slice(0, 10) || '', event: `Added new project: ${p.title}` });
        });
        // Certificates
        (Array.isArray(certificates) ? certificates : certificates.certificates || []).slice(0, 2).forEach((c: any) => {
          activities.push({ date: c.createdAt?.slice(0, 10) || '', event: `Added certificate: ${c.issuer || 'Certificate'}` });
        });
        // Achievements
        (Array.isArray(achievements) ? achievements : achievements.achievements || []).slice(0, 2).forEach((a: any) => {
          activities.push({ date: a.createdAt?.slice(0, 10) || '', event: `Achievement: ${a.title}` });
        });
        // Messages
        (Array.isArray(messages) ? messages : messages.messages || []).slice(0, 2).forEach((m: any) => {
          activities.push({ date: m.createdAt?.slice(0, 10) || '', event: `New message from ${m.name}` });
        });
        // Sort by date desc
        activities.sort((a, b) => (b.date > a.date ? 1 : -1));
        setRecentActivity(activities.slice(0, 6));
      } catch (err) {
        // fallback: do nothing
      }
    }
    if (activeSection === 'dashboard') fetchStatsAndActivity();
  }, [activeSection]);

  // Resume upload state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeUploadMsg, setResumeUploadMsg] = useState<string | null>(null);
  const [resumeUploadSuccess, setResumeUploadSuccess] = useState(false);

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setUploadingResume(true);
    setResumeUploadMsg(null);
    setResumeUploadSuccess(false);
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      const res = await fetch('/api/admin-upload-resume', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        setResumeUploadMsg(data.error || 'Failed to upload resume.');
        setResumeUploadSuccess(false);
      } else {
        setResumeUploadMsg('Resume uploaded successfully!');
        setResumeUploadSuccess(true);
        setResumeFile(null);
        // Optionally, trigger a re-fetch or update
      }
    } catch (err) {
      setResumeUploadMsg('Error uploading resume.');
      setResumeUploadSuccess(false);
    } finally {
      setUploadingResume(false);
    }
  };

  // --- ProjectsManagement logic start ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [link, setLink] = useState("");

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      setProjects(data.projects || data); // support both {projects:[]} and []
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  // Fetch projects on mount
  React.useEffect(() => {
    fetchProjects();
  }, []);

  const openAddDialog = () => {
    setEditingProject(null);
    setTitle("");
    setDescription("");
    setTechStack("");
    setImageBase64("");
    setLink("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (project: any) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setTechStack(project.techStack.join(", "));
    setImageBase64(project.image || "");
    setLink(project.link || "");
    setIsDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteProject = async (id: string | number) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete project');
      await fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const handleSubmit = async () => {
    const projectData = {
      title,
      description,
      techStack: techStack.split(',').map(t => t.trim()),
      date: editingProject ? editingProject.date : new Date().toISOString().slice(0, 10),
      image: imageBase64,
      link,
    };
    try {
      if (editingProject) {
        // Send PUT request to update project
        const id = editingProject._id || editingProject.id;
        const res = await fetch(`/api/projects/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        });
        if (!res.ok) throw new Error('Failed to update project');
        setIsDialogOpen(false);
        await fetchProjects();
        return;
      } else {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        });
        if (!res.ok) throw new Error('Failed to add project');
        setIsDialogOpen(false);
        await fetchProjects();
      }
    } catch (err) {
      console.error('Error submitting project:', err);
    }
  };
  // --- ProjectsManagement logic end ---

  const handleLogout = () => {
    // Placeholder for logout logic
    console.log("Logging out...");
    // In a real app, you would clear session and redirect
  };

  const content = [
    { type: 'project', title: 'E-commerce Platform', description: 'A full-stack e-commerce application built with Next.js, TypeScript, and Tailwind CSS.', date: '2023-12-01' },
    { type: 'project', title: 'Portfolio Website', description: 'A modern, responsive portfolio website showcasing my skills and projects.', date: '2023-11-15' },
    { type: 'project', title: 'Task Management App', description: 'A simple task management application with React and Firebase.', date: '2023-10-20' },
    { type: 'achievement', title: 'React Certification', description: 'Completed the Advanced React course on Udemy.', date: '2023-12-10' },
    { type: 'achievement', title: 'TypeScript Mastery', description: 'Advanced my TypeScript skills through various online tutorials.', date: '2023-11-25' },
    { type: 'achievement', title: 'UI/UX Design Fundamentals', description: 'Completed a beginner UI/UX course on Coursera.', date: '2023-10-15' },
  ];

  // Filter content by type for sections
  const projectsContent = content.filter(item => item.type === 'project')
  const achievements = content.filter(item => item.type === 'achievement')

  return (
    <div className="min-h-screen flex bg-black text-white" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
      <AdminSidebar activeSection={activeSection} setActiveSection={section => {
        if (section === 'logout') handleLogout();
        else setActiveSection(section);
      }} />
      <div className="flex-1 flex flex-col">
        <TopNavbar activeSection={activeSection} />
        <main className="flex-1 p-10 md:ml-64">
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm text-muted-foreground font-display font-medium">Total Projects</CardTitle>
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-display font-bold text-foreground">{stats.projects}</div>
                    <p className="text-xs text-muted-foreground mt-1">Dynamic</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm text-muted-foreground font-display font-medium">Certificates</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-display font-bold text-foreground">{stats.certificates}</div>
                    <p className="text-xs text-muted-foreground mt-1">Dynamic</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm text-muted-foreground font-display font-medium">Skills</CardTitle>
                    <Code className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-display font-bold text-foreground">{stats.skills}</div>
                    <p className="text-xs text-muted-foreground mt-1">Dynamic</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm text-muted-foreground font-display font-medium">Messages</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-display font-bold text-foreground">{stats.messages}</div>
                    <p className="text-xs text-muted-foreground mt-1">Dynamic</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heading font-bold text-foreground">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-muted-foreground">Date</TableHead>
                        <TableHead className="text-muted-foreground">Event</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentActivity.map((activity, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-muted-foreground">{activity.date}</TableCell>
                          <TableCell className="text-foreground">{activity.event}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
          {activeSection === 'projects' && (
            <div className="space-y-6">
              {/* Resume Upload Section */}
              <div className="mb-8 p-6 rounded-lg border border-zinc-700 bg-zinc-900 flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Upload Resume (PDF)</h3>
                  <p className="text-sm text-muted-foreground mb-2">This will replace the current downloadable resume on the portfolio.</p>
                  <input
                    type="file"
                    accept="application/pdf"
                    id="resume-upload"
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                    onChange={e => setResumeFile(e.target.files?.[0] || null)}
                  />
                </div>
                <Button
                  onClick={handleResumeUpload}
                  className="mt-2 md:mt-0"
                  disabled={!resumeFile || uploadingResume}
                >
                  {uploadingResume ? 'Uploading...' : 'Upload Resume'}
                </Button>
                {resumeUploadMsg && (
                  <span className={`ml-4 text-sm ${resumeUploadSuccess ? 'text-green-400' : 'text-red-400'}`}>{resumeUploadMsg}</span>
                )}
              </div>
              {/* End Resume Upload Section */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-heading font-bold text-foreground">Manage Projects</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openAddDialog} className="font-display font-semibold">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-heading font-bold text-xl">
                        {editingProject ? "Edit Project" : "Add New Project"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Project title" />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Project description" />
                      </div>
                      <div>
                        <Label htmlFor="techStack">Tech Stack (comma separated)</Label>
                        <Input id="techStack" value={techStack} onChange={e => setTechStack(e.target.value)} placeholder="React, Node.js, MongoDB" />
                      </div>
                      <div>
                        <Label htmlFor="image">Project Image</Label>
                        <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                        {imageBase64 && (
                          <img src={imageBase64} alt="Preview" className="mt-2 rounded-lg max-h-32 border" />
                        )}
                      </div>
                      <div>
                        <Label htmlFor="link">Project Link</Label>
                        <Input id="link" value={link} onChange={e => setLink(e.target.value)} placeholder="https://yourproject.com" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSubmit}>{editingProject ? "Update" : "Add"} Project</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              {/* Card Layout for Projects */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card key={project._id || project.id} className="hover:shadow-md transition-shadow duration-200 flex flex-col">
                    {project.image && (
                      <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-t-lg" />
                    )}
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-display font-bold text-foreground truncate w-3/4">{project.title}</CardTitle>
                      <FolderOpen className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-2">
                      <p className="text-foreground line-clamp-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.techStack.map((tech: string) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-muted-foreground">{project.date}</span>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(project)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProject(project._id || project.id as string | number)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline text-sm mt-2">View Project</a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          {activeSection === 'certificates' && (
            <CertificatesManagement />
          )}
          {activeSection === 'achievements' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">My Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm text-muted-foreground font-display font-medium">{achievement.title}</CardTitle>
                      <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          {activeSection === 'timeline' && (
            <TimelineManagement />
          )}
          {activeSection === 'skills' && (
            <SkillsManagement />
          )}
          {activeSection === 'contact' && (
            <ContactMessages />
          )}
          {/* Add more sections here as needed, e.g. certificates, timeline, skills, contact */}
        </main>
      </div>
    </div>
  )
}

export function CertificatesManagement() {
  // Remove mockCertificates and mockAchievements
  const [certificates, setCertificates] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formType, setFormType] = useState<'certificate' | 'achievement'>('certificate');
  // Certificate fields
  const [issuer, setIssuer] = useState("");
  const [link, setLink] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  // Achievement fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Fetch certificates from API
  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/certificates');
      if (!res.ok) throw new Error('Failed to fetch certificates');
      const data = await res.json();
      setCertificates(Array.isArray(data) ? data : data.certificates || []);
    } catch (err) {
      console.error('Error fetching certificates:', err);
    }
  };
  // Fetch achievements from API
  const fetchAchievements = async () => {
    try {
      const res = await fetch('/api/achievements');
      if (!res.ok) throw new Error('Failed to fetch achievements');
      const data = await res.json();
      setAchievements(Array.isArray(data) ? data : data.achievements || []);
    } catch (err) {
      console.error('Error fetching achievements:', err);
    }
  };
  React.useEffect(() => {
    fetchCertificates();
    fetchAchievements();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const openAddDialog = (type: 'certificate' | 'achievement') => {
    setEditingItem(null);
    setFormType(type);
    setIssuer("");
    setLink("");
    setTitle("");
    setDescription("");
    setImageBase64("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: any) => {
    setEditingItem(item);
    setFormType(item.type);
    if (item.type === 'certificate') {
      setIssuer(item.issuer || "");
      setLink(item.link);
      setImageBase64(item.image || "");
      setTitle("");
      setDescription("");
    } else {
      setTitle(item.title);
      setDescription(item.description);
      setImageBase64(item.image || "");
      setIssuer("");
      setLink("");
    }
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, type: 'certificate' | 'achievement') => {
    try {
      if (type === 'certificate') {
        const res = await fetch(`/api/certificates/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete certificate');
        await fetchCertificates();
      } else {
        const res = await fetch(`/api/achievements/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete achievement');
        await fetchAchievements();
      }
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const handleSubmit = async () => {
    if (formType === 'certificate') {
      const certData = {
        issuer,
        link,
        image: imageBase64,
        type: 'framed', // always framed
      };
      try {
        if (editingItem && editingItem._id) {
          // Update
          const res = await fetch(`/api/certificates/${editingItem._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(certData),
          });
          if (!res.ok) throw new Error('Failed to update certificate');
        } else {
          // Add
          const res = await fetch('/api/certificates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(certData),
          });
          if (!res.ok) throw new Error('Failed to add certificate');
        }
        setIsDialogOpen(false);
        await fetchCertificates();
      } catch (err) {
        console.error('Error submitting certificate:', err);
      }
    } else {
      const achData = {
        title,
        description,
        image: imageBase64,
        type: 'achievement',
      };
      try {
        if (editingItem && editingItem._id) {
          // Update
          const res = await fetch(`/api/achievements/${editingItem._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(achData),
          });
          if (!res.ok) throw new Error('Failed to update achievement');
        } else {
          // Add
          const res = await fetch('/api/achievements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(achData),
          });
          if (!res.ok) throw new Error('Failed to add achievement');
        }
        setIsDialogOpen(false);
        await fetchAchievements();
      } catch (err) {
        console.error('Error submitting achievement:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-heading font-bold text-foreground">Manage Certificates & Achievements</h2>
        <div className="flex gap-2">
          <Button onClick={() => openAddDialog('certificate')} className="font-display font-semibold">
            <Plus className="h-4 w-4 mr-2" />
            Add Certificate
          </Button>
          <Button onClick={() => openAddDialog('achievement')} className="font-display font-semibold">
            <Plus className="h-4 w-4 mr-2" />
            Add Achievement
          </Button>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading font-bold text-xl">
                {editingItem ? (formType === 'certificate' ? 'Edit Certificate' : 'Edit Achievement') : (formType === 'certificate' ? 'Add New Certificate' : 'Add New Achievement')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button variant={formType === 'certificate' ? 'default' : 'outline'} onClick={() => setFormType('certificate')}>Certificate</Button>
                <Button variant={formType === 'achievement' ? 'default' : 'outline'} onClick={() => setFormType('achievement')}>Achievement</Button>
              </div>
              {formType === 'certificate' ? (
                <>
                  <div>
                    <Label htmlFor="issuer">Issuer (optional)</Label>
                    <Input id="issuer" value={issuer} onChange={e => setIssuer(e.target.value)} placeholder="Issuing organization (optional)" />
                  </div>
                  <div>
                    <Label htmlFor="link">Verification Link</Label>
                    <Input id="link" value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." />
                  </div>
                  <div>
                    <Label htmlFor="image">Certificate Image</Label>
                    <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                    {imageBase64 && (
                      <img src={imageBase64} alt="Preview" className="mt-2 rounded-lg max-h-32 border" />
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="title">Achievement Title</Label>
                    <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Achievement title" />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your achievement" />
                  </div>
                  <div>
                    <Label htmlFor="image">Achievement Image</Label>
                    <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                    {imageBase64 && (
                      <img src={imageBase64} alt="Preview" className="mt-2 rounded-lg max-h-32 border" />
                    )}
                  </div>
                </>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>{editingItem ? 'Update' : 'Add'} {formType === 'certificate' ? 'Certificate' : 'Achievement'}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* Certificates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((certificate: any) => (
          <Card key={certificate._id} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-heading font-bold flex items-start justify-between">
                <span className="flex-1">{certificate.issuer || 'Certificate'}</span>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(certificate)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(certificate._id, 'certificate')}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {certificate.image && (
                <img src={certificate.image} alt={certificate.issuer || 'Certificate'} className="rounded-lg max-h-32 border mb-2" />
              )}
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
                onClick={() => window.open(certificate.link, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Certificate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Achievements List */}
      <div className="mt-10">
        <h3 className="text-lg font-bold mb-4 text-foreground">Achievement Stories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement: any) => (
            <Card key={achievement._id} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-lg font-heading font-bold flex items-start justify-between">
                  <span className="flex-1">{achievement.title}</span>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(achievement)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(achievement._id, 'achievement')}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievement.image && (
                  <img src={achievement.image} alt={achievement.title} className="rounded-lg max-h-32 border mb-2" />
                )}
                <p className="text-foreground">{achievement.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TimelineManagement() {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // List of common timeline emojis
  const emojiList = [
    "🎓", "💻", "🚀", "🌍", "🏆", "🏢", "🧑‍💻", "📚", "📝", "🧑‍🎓", "🧑‍🏫", "🧑‍🔬", "🧑‍🔧", "🧑‍💼", "🧑‍🎤", "🧑‍🎨", "🧑‍🚀"
  ];

  // Close emoji picker on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  // Fetch timeline entries from API
  const fetchTimeline = async () => {
    try {
      const res = await fetch('/api/timeline');
      if (!res.ok) throw new Error('Failed to fetch timeline');
      const data = await res.json();
      setTimeline(Array.isArray(data) ? data : data.timeline || []);
    } catch (err) {
      console.error('Error fetching timeline:', err);
    }
  };

  React.useEffect(() => {
    fetchTimeline();
  }, []);

  const openAddDialog = () => {
    setEditingEntry(null);
    setTitle("");
    setYear("");
    setIcon("");
    setDescription("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (entry: any) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setYear(entry.year);
    setIcon(entry.icon);
    setDescription(entry.description);
    setIsDialogOpen(true);
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const res = await fetch(`/api/timeline/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete timeline entry');
      await fetchTimeline();
    } catch (err) {
      console.error('Error deleting timeline entry:', err);
    }
  };

  const handleSubmit = async () => {
    const entryData = {
      title,
      year,
      icon,
      description,
    };
    try {
      if (editingEntry && editingEntry._id) {
        // Update
        const res = await fetch(`/api/timeline/${editingEntry._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entryData),
        });
        if (!res.ok) throw new Error('Failed to update timeline entry');
      } else {
        // Add
        const res = await fetch('/api/timeline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entryData),
        });
        if (!res.ok) throw new Error('Failed to add timeline entry');
      }
      setIsDialogOpen(false);
      await fetchTimeline();
    } catch (err) {
      console.error('Error submitting timeline entry:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-heading font-bold text-foreground">Manage Timeline</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="font-display font-semibold">
              <Plus className="h-4 w-4 mr-2" />
              Add Timeline Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-heading font-bold text-xl">
                {editingEntry ? "Edit Timeline Entry" : "Add New Timeline Entry"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="icon">Icon (emoji)</Label>
                <div className="flex items-center gap-2">
                  <Input id="icon" value={icon} onChange={e => setIcon(e.target.value)} placeholder="e.g. 🎓" maxLength={2} style={{ width: 80 }} />
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowEmojiPicker(v => !v)} aria-label="Pick emoji">
                    😊
                  </Button>
                </div>
                {showEmojiPicker && (
                  <div ref={emojiPickerRef} className="absolute z-50 mt-2 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg grid grid-cols-8 gap-2" style={{ minWidth: 240 }}>
                    {emojiList.map((e) => (
                      <button
                        key={e}
                        type="button"
                        className="text-2xl p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                        onClick={() => { setIcon(e); setShowEmojiPicker(false); }}
                        aria-label={e}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input id="year" value={year} onChange={e => setYear(e.target.value)} placeholder="e.g. 2023" maxLength={4} />
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Started Computer Science Degree" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe your journey..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>{editingEntry ? "Update" : "Add"} Entry</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {timeline.map((entry: any) => (
          <Card key={entry._id} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <span className="text-3xl rounded-full border-4 border-zinc-800 bg-zinc-900 shadow-lg p-2" style={{ zIndex: 2 }}>{entry.icon}</span>
                  </div>
                  <div>
                    <CardTitle className="font-heading font-bold text-lg">{entry.title}</CardTitle>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900 px-2 py-0.5 rounded-full ml-2">{entry.year}</span>
                    </div>
                    <div className="text-base opacity-80 font-inter">{entry.description}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(entry)} className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEntry(entry._id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Description already shown above */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function SkillsManagement() {
  const [skills, setSkills] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [name, setName] = useState("");

  // Fetch skills from API
  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills');
      let data = await res.json();
      data = Array.isArray(data) ? data : data.skills || [];
      setSkills(data);
    } catch (e) {
      setSkills([]);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openAddDialog = () => {
    setEditingSkill(null);
    setName("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (skill: any) => {
    setEditingSkill(skill);
    setName(skill.name);
    setIsDialogOpen(true);
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete skill');
      await fetchSkills();
    } catch (e) {
      // handle error
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingSkill && editingSkill._id) {
        // Update
        const res = await fetch(`/api/skills/${editingSkill._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });
        if (!res.ok) throw new Error('Failed to update skill');
      } else {
        // Add
        const res = await fetch('/api/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });
        if (!res.ok) throw new Error('Failed to add skill');
      }
      setIsDialogOpen(false);
      await fetchSkills();
    } catch (e) {
      // handle error
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-heading font-bold text-foreground">Manage Skills</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="font-display font-semibold">
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading font-bold text-xl">
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Skill Name</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., React, Python, AWS" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>{editingSkill ? "Update" : "Add"} Skill</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {skills.map((skill: any) => (
          <Card key={skill._id || skill.name} className="hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="font-heading font-bold">{skill.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(skill)} className="h-6 w-6 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSkill(skill._id)}
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ContactMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch messages from API
  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch('/api/contact');
        let data = await res.json();
        data = Array.isArray(data) ? data : data.messages || [];
        setMessages(data);
      } catch (e) {
        setMessages([]);
      }
    }
    fetchMessages();
  }, []);

  const handleViewMessage = (message: any) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
    // Optionally, mark as read in the backend here
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete message');
      setMessages(messages.filter((m: any) => m._id !== id));
    } catch (e) {
      // handle error
    }
  };

  const unreadCount = messages.length; // You can implement status if needed

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-heading font-bold text-foreground">Contact Messages</h2>
          <p className="text-muted-foreground mt-1 font-display">
            {unreadCount} message{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-display font-semibold">Name</TableHead>
                <TableHead className="font-display font-semibold">Email</TableHead>
                <TableHead className="font-display font-semibold">Date</TableHead>
                <TableHead className="font-display font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message: any) => (
                <TableRow key={message._id}>
                  <TableCell className="font-display font-semibold">{message.name}</TableCell>
                  <TableCell className="text-muted-foreground">{message.email}</TableCell>
                  <TableCell className="text-muted-foreground">{new Date(message.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewMessage(message)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`mailto:${message.email}`, "_blank")}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMessage(message._id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading font-bold text-xl">Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">From:</label>
                  <p className="text-foreground">{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email:</label>
                  <p className="text-foreground">{selectedMessage.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date:</label>
                <p className="text-muted-foreground">{new Date(selectedMessage.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Message:</label>
                <div className="bg-muted p-4 rounded-md mt-2">
                  <p className="text-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => window.open(`mailto:${selectedMessage.email}`, "_blank")}>
                  <Mail className="h-4 w-4 mr-2" />
                  Reply
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}