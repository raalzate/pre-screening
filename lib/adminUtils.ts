export interface User {
    name: string;
    email?: string;
    code: string;
    requirements: string;
    step: string;
    form_id: string;
    evaluation_result?: any;
    questions?: any;
    certification_result?: any;
    challenge_result?: any;
    interview_feedback?: string;
    interview_status?: string;
    technical_level?: string;
    interviewer_name?: string;
    reminder_count?: number;
    last_reminder_at?: string;
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

export function isCandidateRejected(candidate: GroupedCandidate): boolean {
    // A candidate is rejected ONLY if all their profiles have an evaluation_result.valid === false
    // If they have no evaluation result yet, they are NOT rejected (pending)
    // If at least one profile is valid, they are NOT rejected (in progress)
    return candidate.profiles.length > 0 && candidate.profiles.every(profile => {
        const result = typeof profile.evaluation_result === 'string'
            ? JSON.parse(profile.evaluation_result)
            : profile.evaluation_result;

        return result && result.valid === false;
    });
}
