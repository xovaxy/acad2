import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type SubscriptionStatus = 'active' | 'expired' | 'cancelled';

interface InstitutionData {
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  website: string;
  studentCount: string;
}

interface AdminData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  designation: string;
}

interface SubscriptionData {
  plan_id: string;
  amount: number;
  order_id?: string;
}

interface AccountCreationData {
  institution: InstitutionData;
  admin: AdminData;
  subscription: SubscriptionData;
}

class SubscriptionService {
  
  async createInstitutionAccount(data: AccountCreationData): Promise<any> {
    try {
      // Start a transaction-like process
      const { institution, admin, subscription } = data;

      console.log('🏢 Creating institution and admin account (no payment required)');

      // 1. Create the admin user in Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: admin.email,
        password: admin.password,
        options: {
          data: {
            first_name: admin.firstName,
            last_name: admin.lastName,
            role: 'admin'
          }
        }
      });

      if (authError) {
        throw new Error(`Failed to create admin user: ${authError.message}`);
      }

      if (!authUser.user) {
        throw new Error('Failed to create admin user');
      }

      // 2. Create institution record with inactive subscription (no payment required yet)
      const institutionData: Database['public']['Tables']['institutions']['Insert'] = {
        name: institution.name,
        email: admin.email, // Required field in the schema
        subscription_status: 'cancelled', // Start as cancelled, will be activated after payment
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: institutionRecord, error: institutionError } = await supabase
        .from('institutions')
        .insert(institutionData)
        .select()
        .single();

      if (institutionError) {
        // Rollback: Delete the auth user if institution creation fails
        await supabase.auth.admin.deleteUser(authUser.user.id);
        
        // Provide specific error message for RLS violations
        if (institutionError.message.includes('row-level security policy')) {
          throw new Error(`Database security policy error. Please contact support or check your database RLS policies. Details: ${institutionError.message}`);
        }
        
        throw new Error(`Failed to create institution: ${institutionError.message}`);
      }

      // 3. Update the automatically created profile with admin details
      const profileData: Database['public']['Tables']['profiles']['Insert'] = {
        user_id: authUser.user.id, // This is the required field
        email: admin.email,
        full_name: `${admin.firstName} ${admin.lastName}`,
        role: 'admin', // Set as admin role with proper typing
        institution_id: institutionRecord.id, // Link to institution
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'user_id' });

      if (profileError) {
        // Rollback: Delete institution and auth user
        await supabase.from('institutions').delete().eq('id', institutionRecord.id);
        await supabase.auth.admin.deleteUser(authUser.user.id);
        throw new Error(`Failed to create admin profile: ${profileError.message}`);
      }

      // 4. Account created successfully - no payment required yet
      console.log('✅ Institution and admin account created successfully');
      console.log('ℹ️ Subscription status: cancelled (payment required to activate)');
      
      // 5. Send welcome email (optional)
      await this.sendWelcomeEmail(admin.email, {
        institutionName: institution.name,
        adminName: `${admin.firstName} ${admin.lastName}`,
        planId: subscription?.plan_id || 'starter'
      });

      return {
        success: true,
        institution_id: institutionRecord.id,
        admin_id: authUser.user.id,
        subscription_status: 'cancelled',
        message: 'Institution and admin account created successfully. Login to complete subscription setup.',
        login_details: {
          email: admin.email,
          institution_name: institution.name,
          next_step: 'Login and complete payment to activate subscription'
        }
      };

    } catch (error) {
      console.error('Error creating institution account:', error);
      throw error;
    }
  }

  private calculateEndDate(planId: string): string {
    // Calculate end date based on plan (assuming monthly plans)
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    return endDate.toISOString();
  }

  private async sendWelcomeEmail(email: string, data: any): Promise<void> {
    // Placeholder for email sending logic
    console.log(`📧 Welcome email would be sent to ${email}`, data);
  }

  async getInstitutionByEmail(email: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          institutions (*)
        `)
        .eq('email', email)
        .eq('role', 'admin')
        .single();

      if (error) {
        throw new Error(`Failed to fetch institution: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching institution:', error);
      throw error;
    }
  }

  async updateSubscriptionStatus(institutionId: string, status: SubscriptionStatus): Promise<void> {
    try {
      console.log(`Updating subscription status for institution ${institutionId} to ${status}`);
      
      const { data, error } = await supabase
        .from('institutions')
        .update({ 
          subscription_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', institutionId)
        .select();

      if (error) {
        throw new Error(`Failed to update subscription status: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error(`No institution found with ID: ${institutionId}`);
      }

      console.log(`Successfully updated subscription status to ${status} for institution:`, data[0].name);
    } catch (error) {
      console.error('Error updating subscription status:', error);
      throw error;
    }
  }

  async updateSubscriptionStatusByOrderId(orderId: string, status: SubscriptionStatus): Promise<void> {
    try {
      console.log(`Updating subscription status for order ${orderId} to ${status}`);
      
      const { data, error } = await supabase
        .from('institutions')
        .update({ 
          subscription_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId) // Note: Using institution ID instead of payment_order_id since that field doesn't exist
        .select();

      if (error) {
        throw new Error(`Failed to update subscription status: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error(`No institution found with order ID: ${orderId}`);
      }

      console.log(`Successfully updated subscription status to ${status} for institution:`, data[0].name);
    } catch (error) {
      console.error('Error updating subscription status by order ID:', error);
      throw error;
    }
  }

  async updatePaymentOrderId(institutionId: string, orderId: string): Promise<void> {
    try {
      console.log(`🔄 Note: payment_order_id field doesn't exist in schema. Storing order ID: ${orderId} for institution: ${institutionId}`);
      
      // Since payment_order_id doesn't exist in the schema, we'll just log this
      // In a real implementation, you might want to create a separate payments table
      // or add this field to the institutions table schema
      
      console.log(`✅ Order ID ${orderId} noted for institution: ${institutionId}`);
      
      // For now, just update the updated_at timestamp
      const { data, error } = await supabase
        .from('institutions')
        .update({ 
          updated_at: new Date().toISOString()
        })
        .eq('id', institutionId)
        .select();

      if (error) {
        throw new Error(`Failed to update institution: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error(`No institution found with ID: ${institutionId}`);
      }

      console.log(`✅ Institution updated: ${data[0].name}`);
    } catch (error) {
      console.error('❌ Error updating institution:', error);
      throw error;
    }
  }

  async activateSubscriptionAfterPayment(orderId: string): Promise<void> {
    try {
      console.log(`🔄 Activating subscription for order: ${orderId}`);
      
      // Try to activate via backend API first
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://acadira-backend-7lxyxsjax-xovaxys-projects.vercel.app';
        const response = await fetch(`${backendUrl}/api/activate-subscription`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ order_id: orderId })
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Subscription activated via backend:', result);
          return;
        } else {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          console.warn('⚠️ Backend activation failed:', errorData);
        }
      } catch (backendError) {
        console.warn('⚠️ Backend not available for activation:', backendError);
      }

      // Fallback to direct database update
      console.log('🎭 Falling back to direct database activation');
      await this.updateSubscriptionStatusByOrderId(orderId, 'active');
      console.log(`✅ Subscription activated successfully for order: ${orderId}`);
    } catch (error) {
      console.error('❌ Error activating subscription:', error);
      throw error;
    }
  }
}

export const subscriptionService = new SubscriptionService();
export type { InstitutionData, AdminData, SubscriptionData, AccountCreationData };
