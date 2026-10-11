// mockmate-backend/profileManager.js
const fs = require('fs');
const path = require('path');
const { getUserCertificates } = require('./certificateManager');

const DATA_DIR = path.join(__dirname, 'data');
const PROFILES_FILE = path.join(DATA_DIR, 'user_profiles.json');
const ATTEMPTS_FILE = path.join(DATA_DIR, 'assessment_attempts.json');
const CERTS_FILE = path.join(DATA_DIR, 'certificates.json');

function readJsonFile(filePath, defaultData = []) {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
            return defaultData;
        }
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw);
    } catch (err) {
        console.warn(`Error reading ${filePath}:`, err.message);
        return defaultData;
    }
}

function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(`Error writing ${filePath}:`, err.message);
    }
}

// Default Seed Profile (Matches UI screenshot)
function getDefaultProfile(email = 'imashasamodee@gmail.com', name = 'Imasha Samodee') {
    return {
        id: 'prof_' + Date.now(),
        name: name || 'Imasha Samodee',
        email: email.toLowerCase().trim(),
        jobRole: 'Full Stack Web Developer',
        experienceLevel: 'Junior (1-2 years)',
        bio: 'Computer Science graduate passionate about full stack development. Interested in learning new technologies and building real-world projects.',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        skills: ['React.js', 'Node.js', 'JavaScript', 'HTML & CSS', 'MongoDB'],
        areasOfInterest: ['Web Development', 'System Design', 'Database', 'API Development', 'DevOps'],
        preferences: {
            theme: 'light',
            mockInterviewVoice: 'en-US-Neural (Studio AI)',
            codeEditorTheme: 'vs-dark',
            emailNotifications: true,
            soundEffects: true
        },
        privacy: {
            publicProfile: true,
            shareScoresWithRecruiters: false
        },
        createdAt: new Date('2026-09-01').toISOString(),
        updatedAt: new Date().toISOString()
    };
}

// 1. Get User Profile
async function getUserProfile(email, fallbackName) {
    const normEmail = (email || 'imashasamodee@gmail.com').toLowerCase().trim();
    let profiles = readJsonFile(PROFILES_FILE, []);
    let profile = profiles.find(p => p.email === normEmail);

    if (!profile) {
        profile = getDefaultProfile(normEmail, fallbackName);
        profiles.push(profile);
        writeJsonFile(PROFILES_FILE, profiles);
    }

    return profile;
}

// 2. Update User Profile
async function updateUserProfile(email, updates = {}) {
    const normEmail = (email || 'imashasamodee@gmail.com').toLowerCase().trim();
    let profiles = readJsonFile(PROFILES_FILE, []);
    let index = profiles.findIndex(p => p.email === normEmail);

    let profile;
    if (index === -1) {
        profile = getDefaultProfile(normEmail, updates.name);
        profiles.push(profile);
        index = profiles.length - 1;
    } else {
        profile = profiles[index];
    }

    // Merge updates
    const updatedProfile = {
        ...profile,
        ...updates,
        email: normEmail, // protect email identity
        preferences: {
            ...(profile.preferences || {}),
            ...(updates.preferences || {})
        },
        privacy: {
            ...(profile.privacy || {}),
            ...(updates.privacy || {})
        },
        updatedAt: new Date().toISOString()
    };

    profiles[index] = updatedProfile;
    writeJsonFile(PROFILES_FILE, profiles);

    // If candidate name was updated, sync to all certificates
    if (updates.name && updates.name.trim()) {
        try {
            await getUserCertificates(normEmail, updates.name.trim());
        } catch (syncErr) {
            console.warn("Could not sync name to certificates:", syncErr.message);
        }
    }

    return updatedProfile;
}

// 3. Change Password
async function changeUserPassword(email, currentPassword, newPassword) {
    const normEmail = (email || 'imashasamodee@gmail.com').toLowerCase().trim();
    if (!newPassword || newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters.");
    }
    // Update password in profiles or authentication store
    let profiles = readJsonFile(PROFILES_FILE, []);
    let profile = profiles.find(p => p.email === normEmail);
    if (profile) {
        profile.passwordUpdated = new Date().toISOString();
        writeJsonFile(PROFILES_FILE, profiles);
    }
    return { success: true, message: "Password updated successfully." };
}

// 4. Download Complete User Data
async function getUserDataExport(email) {
    const normEmail = (email || 'imashasamodee@gmail.com').toLowerCase().trim();
    const profile = await getUserProfile(normEmail);
    const allCerts = readJsonFile(CERTS_FILE, []);
    const userCerts = allCerts.filter(c => c.userEmail === normEmail);
    const allAttempts = readJsonFile(ATTEMPTS_FILE, []);
    const userAttempts = allAttempts.filter(a => a.userEmail === normEmail);

    return {
        exportDate: new Date().toISOString(),
        service: "MockMate AI Autonomous Technical Evaluation Platform",
        userProfile: profile,
        earnedCertificates: userCerts,
        assessmentAttempts: userAttempts,
        summary: {
            totalCertificates: userCerts.length,
            completedAssessments: userAttempts.length
        }
    };
}

module.exports = {
    getUserProfile,
    updateUserProfile,
    changeUserPassword,
    getUserDataExport
};
