/**
 * Patient Dashboard Component
 * Main interface for users to access health services and view their medical information
 * Features:
 * - Quick access to consultations and chat
 * - Health vitals overview
 * - Personalized user information
 */

import Navbar from "@/components/navbar";
import { useState } from "react";

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    {
      label: "Consultations",
      value: "24",
      change: "+12%",
      trend: "up",
    },
    {
      label: "Health Score",
      value: "85",
      change: "+5%",
      trend: "up",
    },
    {
      label: "Active Plans",
      value: "3",
      change: "0",
      trend: "neutral",
    },
    {
      label: "Next Check-up",
      value: "2d",
      change: "",
      trend: "neutral",
    },
  ];

  const recentActivities = [
    {
      type: "consultation",
      title: "Video Consultation",
      description: "Dr. Sarah Johnson - Cardiology",
      date: "Today",
      icon: "👩‍⚕️",
    },
    {
      type: "test",
      title: "Blood Test Results",
      description: "Updated health metrics",
      date: "Yesterday",
      icon: "🔬",
    },
    {
      type: "medication",
      title: "Prescription Renewal",
      description: "Medication schedule updated",
      date: "2 days ago",
      icon: "💊",
    },
  ];

  const upcomingAppointments = [
    {
      doctor: "Dr. Michael Chen",
      specialty: "Neurologist",
      date: "Tomorrow, 10:00 AM",
      type: "Video Call",
      icon: "🧠",
    },
    {
      doctor: "Dr. Lisa Wong",
      specialty: "Dermatologist",
      date: "Next Week, 2:30 PM",
      type: "In-person",
      icon: "🧬",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, <span className="text-accent-400">John</span>
          </h1>
          <p className="text-white/70">Here's an overview of your health status</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="text-white/50 text-sm mb-2">{stat.label}</div>
              <div className="flex items-end gap-2">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                {stat.change && (
                  <div
                    className={`text-sm ${
                      stat.trend === "up"
                        ? "text-accent-400"
                        : stat.trend === "down"
                        ? "text-red-400"
                        : "text-white/50"
                    } mb-1`}
                  >
                    {stat.change}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Activity */}
          <div className="lg:col-span-2 space-y-8">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
              <div className="space-y-6">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xl shrink-0">
                      {activity.icon}
                    </div>
                    <div>
                      <div className="text-white font-medium">{activity.title}</div>
                      <div className="text-white/70 text-sm">
                        {activity.description}
                      </div>
                      <div className="text-white/50 text-sm mt-1">
                        {activity.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Metrics Chart */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-6">
                Health Metrics
              </h2>
              <div className="aspect-video rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                <span className="text-white/50">Health metrics visualization</span>
              </div>
            </div>
          </div>

          {/* Right Column - Upcoming Appointments */}
          <div className="space-y-8">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-6">
                Upcoming Appointments
              </h2>
              <div className="space-y-6">
                {upcomingAppointments.map((appointment, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xl">
                        {appointment.icon}
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {appointment.doctor}
                        </div>
                        <div className="text-accent-400 text-sm">
                          {appointment.specialty}
                        </div>
                      </div>
                    </div>
                    <div className="text-white/70 text-sm">{appointment.date}</div>
                    <div className="text-white/50 text-sm">{appointment.type}</div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors duration-200">
                View All Appointments
              </button>
            </div>

            {/* Quick Actions */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-6">
                Quick Actions
              </h2>
              <div className="space-y-4">
                <button className="w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-lg transition-colors duration-200">
                  Schedule Appointment
                </button>
                <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors duration-200">
                  View Medical Records
                </button>
                <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors duration-200">
                  Message Doctor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}