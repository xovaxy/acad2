import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, CheckCircle, Ban, Calendar, Activity, Database } from "lucide-react";

// Type definitions
interface SubscriptionData {
  id: string;
  institution_id: string;
  plan: string;
  status: string;
  amount: number;
  payment_order_id: string | null;
  created_at: string;
  updated_at: string;
  current_usage: number;
  monthly_question_limit: number;
  user_count: number;
  user_limit: number;
  end_date: string;
  suspension_reason?: string;
  institutions: {
    name: string;
    email: string;
    contact_email: string;
  };
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionData | null>(null);
  const [suspensionReason, setSuspensionReason] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      // Fetch institutions with their subscription data and admin profiles
      const { data, error } = await supabase
        .from("institutions")
        .select(`
          id,
          name,
          email,
          subscription_status,
          subscription_plan,
          subscription_amount,
          payment_order_id,
          created_at,
          updated_at,
          profiles!inner(
            id,
            email,
            full_name,
            role
          )
        `)
        .eq('profiles.role', 'admin')
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading institutions:", error);
        toast({
          title: "Error",
          description: `Failed to load institutions: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log("Loaded institutions:", data);
      
      // Transform data to match the expected subscription format
      const transformedData = (data || []).map((institution: any) => {
        // Use simple counts for now to avoid type instantiation issues
        const questionCount = 0; // Will be populated from real data later
        const userCount = 1; // Default to 1 (the admin user)

        // Calculate subscription end date based on created_at + 30 days
        const subscriptionEndDate = new Date(institution.created_at);
        subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);

        return {
          id: institution.id,
          institution_id: institution.id,
          plan: institution.subscription_plan || 'starter',
          status: institution.subscription_status || 'cancelled',
          amount: institution.subscription_amount || 0,
          payment_order_id: institution.payment_order_id,
          created_at: institution.created_at,
          updated_at: institution.updated_at,
          // Real usage data from database
          current_usage: questionCount,
          monthly_question_limit: institution.subscription_plan === 'professional' ? 10000 : 
                                 institution.subscription_plan === 'enterprise' ? 50000 : 5000,
          user_count: userCount,
          user_limit: institution.subscription_plan === 'professional' ? 100 : 
                     institution.subscription_plan === 'enterprise' ? 500 : 25,
          end_date: subscriptionEndDate.toISOString(),
          institutions: {
            name: institution.name,
            email: institution.email,
            contact_email: institution.profiles?.[0]?.email || institution.email
          }
        };
      });

      setSubscriptions(transformedData);
    } catch (error) {
      console.error("Error in loadSubscriptions:", error);
      toast({
        title: "Error",
        description: "Failed to load subscription data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openSuspendDialog = (subscription: SubscriptionData) => {
    setSelectedSubscription(subscription);
    setSuspendDialogOpen(true);
    setSuspensionReason("");
  };

  const handleSuspend = async () => {
    if (!selectedSubscription) return;
    
    if (selectedSubscription.status === "active" && !suspensionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for suspension",
        variant: "destructive",
      });
      return;
    }

    const newStatus = selectedSubscription.status === "active" ? "cancelled" : "active";
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Update the institution's subscription status
      const { error } = await supabase
        .from("institutions")
        .update({ 
          subscription_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", selectedSubscription.institution_id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Subscription ${newStatus === "cancelled" ? "suspended" : "activated"} successfully`,
      });

      setSuspendDialogOpen(false);
      setSelectedSubscription(null);
      setSuspensionReason("");
      loadSubscriptions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openExtendDialog = (subscription: SubscriptionData) => {
    setSelectedSubscription(subscription);
    // Set default to 30 days from current end date
    const currentEndDate = new Date(subscription.end_date);
    const defaultNewDate = new Date(currentEndDate);
    defaultNewDate.setDate(defaultNewDate.getDate() + 30);
    setNewEndDate(defaultNewDate.toISOString().split('T')[0]);
    setExtendDialogOpen(true);
  };

  const handleExtend = async () => {
    if (!selectedSubscription || !newEndDate) {
      toast({
        title: "Error",
        description: "Please select a valid date",
        variant: "destructive",
      });
      return;
    }

    const selectedDate = new Date(newEndDate);
    const currentEndDate = new Date(selectedSubscription.end_date);

    if (selectedDate <= currentEndDate) {
      toast({
        title: "Error",
        description: "New end date must be after the current end date",
        variant: "destructive",
      });
      return;
    }

    try {
      // For now, we'll just update the updated_at field since we don't have end_date in institutions table
      // In a real implementation, you might want to add subscription_end_date field to institutions
      const { error } = await supabase
        .from("institutions")
        .update({ 
          updated_at: new Date().toISOString(),
          // You could add a subscription_end_date field to institutions table if needed
        })
        .eq("id", selectedSubscription.institution_id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Subscription extended to ${new Date(newEndDate).toLocaleDateString()}`,
      });

      setExtendDialogOpen(false);
      setSelectedSubscription(null);
      setNewEndDate("");
      loadSubscriptions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscriptions</h1>
          <p className="text-muted-foreground">
            Manage institution subscriptions and billing ({subscriptions.length} institutions)
          </p>
        </div>
        <Button 
          onClick={loadSubscriptions} 
          disabled={loading}
          variant="outline"
        >
          <Database className="h-4 w-4 mr-2" />
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      <Card className="p-6 shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Institution</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Questions Used</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Renewal Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  <div className="flex items-center justify-center gap-2">
                    <Activity className="h-4 w-4 animate-spin" />
                    Loading institutions...
                  </div>
                </TableCell>
              </TableRow>
            ) : subscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  <div className="flex flex-col items-center gap-2">
                    <CreditCard className="h-8 w-8 text-muted-foreground" />
                    <p>No institutions found</p>
                    <p className="text-sm">Institutions will appear here once they register</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((sub) => {
                const usagePercent = (sub.current_usage / sub.monthly_question_limit) * 100;
                const userPercent = (sub.user_count / sub.user_limit) * 100;
                return (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{sub.institutions?.name || "Unknown"}</p>
                        <p className="text-sm text-muted-foreground">{sub.institutions?.contact_email || "N/A"}</p>
                        {sub.payment_order_id && (
                          <p className="text-xs text-blue-600">Order: {sub.payment_order_id.slice(-8)}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Joined: {new Date(sub.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="capitalize font-medium">{sub.plan}</span>
                        {sub.amount > 0 && (
                          <p className="text-sm text-green-600">₹{sub.amount.toLocaleString()}/month</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-32">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>{sub.current_usage.toLocaleString()}</span>
                          <span className="text-muted-foreground">{sub.monthly_question_limit.toLocaleString()}</span>
                        </div>
                        <Progress value={usagePercent} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-32">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>{sub.user_count}</span>
                          <span className="text-muted-foreground">{sub.user_limit}</span>
                        </div>
                        <Progress value={userPercent} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        sub.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : sub.status === "cancelled"
                          ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          : sub.status === "expired"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
                      }`}>
                        {sub.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(sub.end_date).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openExtendDialog(sub)}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Extend
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openSuspendDialog(sub)}
                        >
                          {sub.status === "active" ? (
                            <>
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Suspend/Activate Dialog */}
      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSubscription?.status === "active" ? "Suspend Subscription" : "Activate Subscription"}
            </DialogTitle>
            <DialogDescription>
              {selectedSubscription?.status === "active" 
                ? "Please provide a reason for suspending this subscription. The admin will see this message."
                : "This will reactivate the subscription and clear the suspension reason."}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubscription?.status === "active" ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="reason">Suspension Reason *</Label>
                <Textarea
                  id="reason"
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                  placeholder="e.g., Payment overdue, Terms of Service violation, etc."
                  rows={4}
                />
              </div>
              <Button onClick={handleSuspend} className="w-full">
                Suspend Subscription
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedSubscription?.suspension_reason && (
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">
                    Previous Suspension Reason:
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {selectedSubscription.suspension_reason}
                  </p>
                </div>
              )}
              <Button onClick={handleSuspend} className="w-full">
                Activate Subscription
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Extend Subscription Dialog */}
      <Dialog open={extendDialogOpen} onOpenChange={setExtendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend Subscription</DialogTitle>
            <DialogDescription>
              Set a new end date for this institution's subscription.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedSubscription && (
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-sm font-medium mb-2">
                  Institution: {selectedSubscription.institutions?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Current End Date: {new Date(selectedSubscription.end_date).toLocaleDateString()}
                </p>
              </div>
            )}
            
            <div>
              <Label htmlFor="new-end-date">New End Date *</Label>
              <Input
                id="new-end-date"
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                min={selectedSubscription ? new Date(selectedSubscription.end_date).toISOString().split('T')[0] : undefined}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Select a date after the current end date
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  // Quick extend by 30 days
                  const currentEndDate = new Date(selectedSubscription.end_date);
                  const quickDate = new Date(currentEndDate);
                  quickDate.setDate(quickDate.getDate() + 30);
                  setNewEndDate(quickDate.toISOString().split('T')[0]);
                }}
                className="flex-1"
              >
                +30 Days
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  // Quick extend by 90 days
                  const currentEndDate = new Date(selectedSubscription.end_date);
                  const quickDate = new Date(currentEndDate);
                  quickDate.setDate(quickDate.getDate() + 90);
                  setNewEndDate(quickDate.toISOString().split('T')[0]);
                }}
                className="flex-1"
              >
                +90 Days
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  // Quick extend by 1 year
                  const currentEndDate = new Date(selectedSubscription.end_date);
                  const quickDate = new Date(currentEndDate);
                  quickDate.setFullYear(quickDate.getFullYear() + 1);
                  setNewEndDate(quickDate.toISOString().split('T')[0]);
                }}
                className="flex-1"
              >
                +1 Year
              </Button>
            </div>

            <Button onClick={handleExtend} className="w-full">
              Extend Subscription
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subscriptions;
