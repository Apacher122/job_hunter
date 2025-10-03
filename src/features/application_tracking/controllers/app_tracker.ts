import * as applications from "../services/app_tracker.js";
import * as db from "@database/index.js";

import { Request, Response } from "express";

import { AuthenticatedRequest } from "@shared/middleware/authenticate.js";

export const newJobHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authReq = req as AuthenticatedRequest;
  const apiKey = (req as any).body.apiKey;
  try {
    const jobPost = JSON.stringify(req.body);
    await applications.trackNewJob(authReq.user.uid, jobPost, apiKey);
    res
      .status(200)
      .json({ success: true, message: "Job info processed successfully" });
  } catch (error) {
    const e = error as Error;
    console.error(`Error processing job info: ${e.message}`);
    res.status(500).json({
      success: false,
      message: `Error processing job info: ${e.message}`,
    });
  }
};

// export const markApplication = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const id = Number(req.body.id);
//     const applied = Boolean(req.body.applied);
//     await setJobApplied(id, applied);
//     await insertRowToSheet(id);
//     res.status(200).json({ success: true, message: "Job marked as applied" });
//   } catch (error) {
//     const e = error as Error;
//     console.error(`Error adding resume to sheet: ${e.message}`);
//     res.status(500).json({
//       success: false,
//       message: `Error marking job as applied: ${e.message}`,
//     });
//   }
// };

export const getJobApplications = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authReq = req as AuthenticatedRequest;
  try {
    const jobs = await db.getAllUserJobPostings(authReq.user.uid);
    res.json(jobs);
  } catch (error) {
    const e = error as Error;
    console.error(`Error fetching application list: ${e.message}`);
    res.status(500).json({
      success: false,
      message: `Error fetching application list: ${e.message}`,
    });
  }
};

export const updateApplication = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const uid = authReq.user.uid;
  const roleId  = req.query.roleId;
  const status = req.body?.payload?.status ?? null;
  const applicationDate = req.body?.payload?.date ?? null;

  if (!roleId) {
    return res.status(400).json({ message: "Role ID and status are required." });
  }

  const updates = {
    status: status,
    application_date: applicationDate
  }

  try {
    const updatedApplication = await db.updateApplicationDetails(
      Number(roleId),
      uid,
      updates
    );
    if (!updatedApplication) {
      return res.status(404).json({
        message: "Application not found or you do not have permission to update it.",
      });
    }
    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Failed to update application status." });
  }
};

export const deleteApp = async (
  req: Request,
  res: Response
) => {

  const roleId = req.query.jobId;
  const authReq = req as AuthenticatedRequest;
  const uid = authReq.user.uid;
  console.log(`Deleting application with role ID: ${roleId}`);
  try {
    const deletedApplication = await db.deleteJobPostById(
      Number(roleId),
      uid
    );
    if (!deletedApplication) {
      return res.status(404).json({
        message: "Application not found or you do not have permission to delete it.",
      });
    }
    res.status(200).json({ message: "Application deleted successfully." });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Failed to delete application." });
  }
};