export interface AppliedJob {
    id: string;
    company: string;
    position: string;
    url?: string;
    appliedOn: Date;
    userApplied: boolean;
    applied: boolean;
    status: 'Open' | 'Rejected' | 'Offered';
    codeAssessmentCompleted: boolean;
    interviewCount: number;
    initialAppUpdateDate: Date;
}