export interface User {
    name: string;
    email?: string;
    code: string;
    requirements: string;
    step: string;
    form_id: string;
    evaluation_result?: string;
    questions?: string;
    certification_result?: string;
    challenge_result?: string;
    interview_feedback?: string;
    interview_status?: string;
    technical_level?: string;
    interviewer_name?: string;
}

export interface GroupedCandidate {
    code: string;
    name: string;
    email: string | null;
    profiles: User[];
}

export function groupCandidatesByCode(users: User[]): GroupedCandidate[] {
    const groups: Record<string, GroupedCandidate> = {};

    for (const user of users) {
        if (!groups[user.code]) {
            groups[user.code] = {
                code: user.code,
                name: user.name, // Take first name found
                email: user.email || null,
                profiles: [],
            };
        }
        groups[user.code].profiles.push(user);
    }

    // Convert map to array
    return Object.values(groups);
}
