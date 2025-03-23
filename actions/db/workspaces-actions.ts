"use server"

import { ActionState } from "@/types"
import { createServerClient } from "@/lib/supabase/server-client"
import { cookies } from "next/headers"

export async function createWorkspaceAction(
  workspace: any
): Promise<ActionState<any>> {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)
    
    const { data, error } = await supabase
      .from("workspaces")
      .insert([workspace])
      .select("*")
      .single()
    
    if (error) throw error
    
    return {
      isSuccess: true,
      message: "Workspace created successfully",
      data
    }
  } catch (error) {
    console.error("Error creating workspace:", error)
    return { isSuccess: false, message: "Failed to create workspace" }
  }
}

export async function getWorkspaceByIdAction(
  id: string
): Promise<ActionState<any>> {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)
    
    const { data: workspace, error } = await supabase
      .from("workspaces")
      .select("*")
      .eq("id", id)
      .single()
    
    if (error) throw error
    
    return {
      isSuccess: true,
      message: "Workspace retrieved successfully",
      data: workspace
    }
  } catch (error) {
    console.error("Error getting workspace:", error)
    return { isSuccess: false, message: "Failed to get workspace" }
  }
}

export async function getWorkspacesByUserIdAction(
  userId: string
): Promise<ActionState<any[]>> {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)
    
    const { data: workspaces, error } = await supabase
      .from("workspaces")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    
    if (error) throw error
    
    return {
      isSuccess: true,
      message: "Workspaces retrieved successfully",
      data: workspaces
    }
  } catch (error) {
    console.error("Error getting workspaces:", error)
    return { isSuccess: false, message: "Failed to get workspaces" }
  }
}

export async function getHomeWorkspaceByUserIdAction(
  userId: string
): Promise<ActionState<any>> {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)
    
    const { data: workspace, error } = await supabase
      .from("workspaces")
      .select("*")
      .eq("user_id", userId)
      .eq("is_home", true)
      .single()
    
    if (error) throw error
    
    return {
      isSuccess: true,
      message: "Home workspace retrieved successfully",
      data: workspace
    }
  } catch (error) {
    console.error("Error getting home workspace:", error)
    return { isSuccess: false, message: "Failed to get home workspace" }
  }
}

export async function updateWorkspaceAction(
  id: string,
  data: any
): Promise<ActionState<any>> {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)
    
    const { data: updatedWorkspace, error } = await supabase
      .from("workspaces")
      .update(data)
      .eq("id", id)
      .select("*")
      .single()
    
    if (error) throw error
    
    return {
      isSuccess: true,
      message: "Workspace updated successfully",
      data: updatedWorkspace
    }
  } catch (error) {
    console.error("Error updating workspace:", error)
    return { isSuccess: false, message: "Failed to update workspace" }
  }
}

export async function deleteWorkspaceAction(id: string): Promise<ActionState<void>> {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)
    
    const { error } = await supabase
      .from("workspaces")
      .delete()
      .eq("id", id)
    
    if (error) throw error
    
    return {
      isSuccess: true,
      message: "Workspace deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting workspace:", error)
    return { isSuccess: false, message: "Failed to delete workspace" }
  }
} 