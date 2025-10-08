import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Users, Activity, CreditCard, TrendingUp, Calendar, DollarSign, CheckCircle, XCircle, Clock, AlertTriangle, Server, Database, Zap, BarChart3, UserCheck, MessageSquare, Shield, Settings, Download, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalInstitutions: 0,
    totalUsers: 0,
    totalQuestions: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    cancelledSubscriptions: 0,
  });

  const [recentInstitutions, setRecentInstitutions] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [subscriptionBreakdown, setSubscriptionBreakdown] = useState({
    active: 0,
    cancelled: 0,
    expired: 0,
  });
  const [userActivity, setUserActivity] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);

      // Load institutions count
      const { count: institutionsCount } = await supabase
        .from("institutions")
        .select("*", { count: "exact", head: true });

      // Load users count
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Load total questions count
      const { count: questionsCount } = await supabase
        .from("chat_messages")
        .select("*", { count: "exact", head: true })
        .eq("role", "user");

      // Load subscription breakdown
      const { data: subscriptionData } = await supabase
        .from("institutions")
        .select("subscription_status, subscription_amount");

      const breakdown = {
        active: 0,
        cancelled: 0,
        expired: 0,
      };

      let totalRevenue = 0;
      let activeCount = 0;

      subscriptionData?.forEach((institution: any) => {
        const status = institution.subscription_status || 'cancelled';
        breakdown[status as keyof typeof breakdown]++;
        
        if (status === 'active') {
          activeCount++;
          totalRevenue += institution.subscription_amount || 0;
        }
      });

      // Load recent institutions (last 10)
      const { data: recentInstitutionsData } = await supabase
        .from("institutions")
        .select("id, name, subscription_status, subscription_plan, created_at")
        .order("created_at", { ascending: false })
        .limit(10);

      // Load recent payments (institutions with payment_order_id)
      const { data: recentPaymentsData } = await supabase
        .from("institutions")
        .select("id, name, subscription_amount, subscription_plan, payment_order_id, subscription_status, created_at")
        .not("payment_order_id", "is", null)
        .order("created_at", { ascending: false })
        .limit(10);

      setStats({
        totalInstitutions: institutionsCount || 0,
        totalUsers: usersCount || 0,
        totalQuestions: questionsCount || 0,
        activeSubscriptions: activeCount,
        totalRevenue: totalRevenue,
        cancelledSubscriptions: breakdown.cancelled,
      });

      setSubscriptionBreakdown(breakdown);
      setRecentInstitutions(recentInstitutionsData || []);
      setRecentPayments(recentPaymentsData || []);

      // Load real user activity from profiles table
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("full_name, email, role, created_at, updated_at")
        .order("updated_at", { ascending: false })
        .limit(10);

      const realActivity = profilesData?.map((profile: any) => ({
        user: profile.full_name || profile.email || 'Unknown User',
        action: profile.role === 'admin' ? 'Admin activity' : 'User activity',
        timestamp: new Date(profile.updated_at || profile.created_at)
      })) || [];
      setUserActivity(realActivity);

      // Load real alerts from recent database activity
      const realAlerts = [];
      
      // Check for new institutions in last 24 hours
      const { count: newInstitutionsToday } = await supabase
        .from("institutions")
        .select("*", { count: "exact", head: true })
        .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (newInstitutionsToday && newInstitutionsToday > 0) {
        realAlerts.push({
          type: 'info',
          message: `${newInstitutionsToday} new institution(s) registered today`,
          timestamp: new Date()
        });
      }

      // Check for recent payments
      const { count: recentPaymentsCount } = await supabase
        .from("institutions")
        .select("*", { count: "exact", head: true })
        .not("payment_order_id", "is", null)
        .gte("updated_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (recentPaymentsCount && recentPaymentsCount > 0) {
        realAlerts.push({
          type: 'success',
          message: `${recentPaymentsCount} payment(s) processed in last 24 hours`,
          timestamp: new Date()
        });
      }

      // Check for cancelled subscriptions
      if (breakdown.cancelled > breakdown.active) {
        realAlerts.push({
          type: 'warning',
          message: `${breakdown.cancelled} institutions have cancelled subscriptions`,
          timestamp: new Date()
        });
      }

      setRecentAlerts(realAlerts);

    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      const exportData = {
        stats,
        institutions: recentInstitutions,
        payments: recentPayments,
        subscriptionBreakdown,
        userActivity,
        recentAlerts,
        exportedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `acadira-admin-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive platform management and analytics</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={loadStats} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="activity">User Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <Card className="p-4 shadow-card bg-gradient-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900 flex-shrink-0">
                  <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground truncate">Total Institutions</p>
                  <p className="text-xl font-bold truncate">{loading ? '...' : stats.totalInstitutions}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 shadow-card bg-gradient-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 flex-shrink-0">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground truncate">Total Users</p>
                  <p className="text-xl font-bold truncate">{loading ? '...' : stats.totalUsers}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 shadow-card bg-gradient-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900 flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground truncate">Active Subscriptions</p>
                  <p className="text-xl font-bold truncate">{loading ? '...' : stats.activeSubscriptions}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 shadow-card bg-gradient-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900 flex-shrink-0">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground truncate">Cancelled Subscriptions</p>
                  <p className="text-xl font-bold truncate">{loading ? '...' : stats.cancelledSubscriptions}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 shadow-card bg-gradient-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex-shrink-0">
                  <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground truncate">Total Revenue</p>
                  <p className="text-lg font-bold truncate">₹{loading ? '...' : stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 shadow-card bg-gradient-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900 flex-shrink-0">
                  <MessageSquare className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground truncate">Total Questions</p>
                  <p className="text-lg font-bold truncate">{loading ? '...' : stats.totalQuestions.toLocaleString()}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activity Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Payments */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Recent Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-4 text-muted-foreground">Loading...</div>
                  ) : recentPayments.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">No payments found</div>
                  ) : (
                    recentPayments.map((payment: any) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{payment.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {payment.subscription_plan} Plan • Order: {payment.payment_order_id?.slice(-8)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-green-600 text-sm">₹{payment.subscription_amount?.toLocaleString()}</p>
                          <Badge variant={payment.subscription_status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {payment.subscription_status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recently Joined Institutions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Recently Joined Institutions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-4 text-muted-foreground">Loading...</div>
                  ) : recentInstitutions.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">No institutions found</div>
                  ) : (
                    recentInstitutions.map((institution: any) => (
                      <div key={institution.id} className="flex items-center justify-between p-3 border rounded-lg gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{institution.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {institution.subscription_plan} Plan
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Joined: {new Date(institution.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <Badge 
                            variant={
                              institution.subscription_status === 'active' ? 'default' : 
                              institution.subscription_status === 'cancelled' ? 'secondary' : 
                              'destructive'
                            }
                            className="text-xs"
                          >
                            {institution.subscription_status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Breakdown */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Subscription Status Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{subscriptionBreakdown.active}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-600">{subscriptionBreakdown.cancelled}</p>
                  <p className="text-sm text-muted-foreground">Cancelled</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-red-50 dark:bg-red-900/20">
                  <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">{subscriptionBreakdown.cancelled}</p>
                  <p className="text-sm text-muted-foreground">Cancelled</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/20">
                  <Activity className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-600">{subscriptionBreakdown.expired}</p>
                  <p className="text-sm text-muted-foreground">Expired</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Revenue Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Revenue</span>
                    <span className="font-bold text-green-600">₹{stats.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Active Subscriptions</span>
                    <span className="font-bold">{stats.activeSubscriptions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Revenue per Institution</span>
                    <span className="font-bold">₹{stats.activeSubscriptions > 0 ? Math.floor(stats.totalRevenue / stats.activeSubscriptions).toLocaleString() : 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-purple-600" />
                  Subscription Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Active Subscriptions</span>
                    <span className="font-bold text-green-600">{stats.activeSubscriptions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cancelled Subscriptions</span>
                    <span className="font-bold text-yellow-600">{stats.cancelledSubscriptions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Activation Rate</span>
                    <span className="font-bold">
                      {stats.totalInstitutions > 0 ? Math.floor((stats.activeSubscriptions / stats.totalInstitutions) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-green-600" />
                  Database Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Institutions</span>
                    <Badge variant="default">{stats.totalInstitutions}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Users</span>
                    <Badge variant="default">{stats.totalUsers}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Messages</span>
                    <Badge variant="default">{stats.totalQuestions}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Active Subscriptions</span>
                    <Badge variant={stats.activeSubscriptions > 0 ? "default" : "secondary"}>
                      {stats.activeSubscriptions}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAlerts.map((alert: any, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 border rounded">
                      <div className={`w-2 h-2 rounded-full ${
                        alert.type === 'warning' ? 'bg-yellow-500' :
                        alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {alert.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Recent User Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userActivity.map((activity: any, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{activity.user}</p>
                        <p className="text-sm text-muted-foreground truncate">{activity.action}</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground flex-shrink-0">
                      {activity.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="p-6 shadow-card">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/superadmin/institutions" className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900 flex-shrink-0">
                <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">Manage Institutions</p>
                <p className="text-sm text-muted-foreground truncate">Add or manage institutions</p>
              </div>
            </div>
          </a>
          
          <a href="/superadmin/subscriptions" className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900 flex-shrink-0">
                <CreditCard className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">Manage Subscriptions</p>
                <p className="text-sm text-muted-foreground truncate">View and manage subscriptions</p>
              </div>
            </div>
          </a>

          <button 
            onClick={loadStats}
            className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">Refresh Data</p>
                <p className="text-sm text-muted-foreground truncate">Update dashboard statistics</p>
              </div>
            </div>
          </button>

          <button 
            onClick={exportData}
            className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900 flex-shrink-0">
                <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">Export Report</p>
                <p className="text-sm text-muted-foreground truncate">Download analytics data</p>
              </div>
            </div>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default SuperAdminDashboard;
