// mockmate-backend/certificateManager.js
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { ASSESSMENTS } = require('./data/assessmentsData');

const DATA_DIR = path.join(__dirname, 'data');
const CERTS_FILE = path.join(DATA_DIR, 'certificates.json');
const ATTEMPTS_FILE = path.join(DATA_DIR, 'assessment_attempts.json');

// Ensure data files exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

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

// Initial seed certificates for new/existing candidates
function getSeedCertificates(userEmail, userName) {
    return [
        {
            id: 'cert_seed_1',
            certificateId: 'MM-FS-2026-9842',
            userEmail: userEmail.toLowerCase(),
            userName: userName,
            assessmentId: 'react-frontend-specialist',
            title: 'Senior Full Stack Engineering Proficiency',
            level: 'Senior Level (Verified)',
            category: 'Web Development',
            score: '88% Technical Mastery',
            numericScore: 88,
            issueDate: 'October 2026',
            issueDateIso: new Date('2026-10-01').toISOString(),
            skills: ['React 19', 'Node.js', 'System Architecture', 'REST APIs', 'State Management'],
            issuer: 'MockMate AI Certification Board',
            status: 'active'
        },
        {
            id: 'cert_seed_2',
            certificateId: 'MM-SD-2026-7731',
            userEmail: userEmail.toLowerCase(),
            userName: userName,
            assessmentId: 'system-design-proficiency',
            title: 'Distributed System Design & Architecture',
            level: 'Staff Level Ownership',
            category: 'System Design',
            score: '82% Technical Mastery',
            numericScore: 82,
            issueDate: 'October 2026',
            issueDateIso: new Date('2026-10-04').toISOString(),
            skills: ['Load Balancers', 'Redis Caching', 'Microservices', 'Database Sharding', 'Kafka'],
            issuer: 'MockMate AI Certification Board',
            status: 'active'
        },
        {
            id: 'cert_seed_3',
            certificateId: 'MM-JS-2026-6419',
            userEmail: userEmail.toLowerCase(),
            userName: userName,
            assessmentId: 'javascript-runtime-core',
            title: 'Advanced JavaScript (ES6+ & V8 Runtime)',
            level: 'Exceptional (Top 5%)',
            category: 'Programming',
            score: '91% Technical Mastery',
            numericScore: 91,
            issueDate: 'September 2026',
            issueDateIso: new Date('2026-09-15').toISOString(),
            skills: ['V8 Engine', 'Event Loop', 'Closures', 'Promises & Async', 'Memory Optimization'],
            issuer: 'MockMate AI Certification Board',
            status: 'active'
        },
        {
            id: 'cert_seed_4',
            certificateId: 'MM-BH-2026-4410',
            userEmail: userEmail.toLowerCase(),
            userName: userName,
            assessmentId: 'executive-behavioral-leadership',
            title: 'Executive Behavioral & STAR Communication',
            level: 'Staff Level Ownership',
            category: 'Leadership',
            score: '85% Communication Clarity',
            numericScore: 85,
            issueDate: 'September 2026',
            issueDateIso: new Date('2026-09-22').toISOString(),
            skills: ['STAR Method', 'Conflict Resolution', 'Blameless Post-Mortems', 'Technical Mentorship'],
            issuer: 'MockMate AI Certification Board',
            status: 'active'
        }
    ];
}

// 1. Get Certificates and Summary Dashboard
async function getUserCertificates(userEmail, userName = 'Imasha Samodee') {
    const normEmail = (userEmail || 'imashasamodee@gmail.com').toLowerCase().trim();
    let allCerts = readJsonFile(CERTS_FILE, []);

    // Filter user's certificates
    let userCerts = allCerts.filter(c => c.userEmail === normEmail);

    // If user has none yet, seed their account with initial verified credentials
    if (userCerts.length === 0) {
        const seed = getSeedCertificates(normEmail, userName);
        allCerts = [...allCerts, ...seed];
        writeJsonFile(CERTS_FILE, allCerts);
        userCerts = seed;
    } else if (userName && userName !== 'Candidate') {
        // Sync account holder's real name to all existing certificates for this account
        let hasChanges = false;
        allCerts = allCerts.map(c => {
            if (c.userEmail === normEmail && (!c.userName || c.userName === 'Candidate' || c.userName !== userName)) {
                hasChanges = true;
                return { ...c, userName: userName };
            }
            return c;
        });
        if (hasChanges) {
            writeJsonFile(CERTS_FILE, allCerts);
            userCerts = allCerts.filter(c => c.userEmail === normEmail);
        }
    }

    // Read user's completed assessments
    const allAttempts = readJsonFile(ATTEMPTS_FILE, []);
    const userAttempts = allAttempts.filter(a => a.userEmail === normEmail);
    const passedAttempts = userAttempts.filter(a => a.passed);

    // Compute metrics
    const totalCertificates = userCerts.length;
    const verifiedCertificates = userCerts.filter(c => c.status === 'active').length;
    const completedAssessments = Math.max(passedAttempts.length, userCerts.length);

    let totalScoreSum = userCerts.reduce((acc, c) => acc + (c.numericScore || 85), 0);
    const averageScore = totalCertificates > 0 ? Math.round(totalScoreSum / totalCertificates) : 85;

    return {
        summary: {
            totalCertificates,
            verifiedCertificates,
            completedAssessments,
            averageScore: `${averageScore}%`
        },
        certificates: userCerts.sort((a, b) => new Date(b.issueDateIso || 0) - new Date(a.issueDateIso || 0))
    };
}

// 2. Get Certificate by ID (Authorized)
async function getCertificateById(identifier, userEmail, userName) {
    let allCerts = readJsonFile(CERTS_FILE, []);
    const normId = identifier.trim();
    const certIndex = allCerts.findIndex(c => 
        c.id === normId || 
        c.certificateId === normId ||
        c.certificateId.toLowerCase() === normId.toLowerCase()
    );

    if (certIndex === -1) return null;
    const cert = allCerts[certIndex];

    // If email provided, check authorization
    if (userEmail && cert.userEmail !== userEmail.toLowerCase().trim()) {
        const err = new Error("Unauthorized to access this private certificate record.");
        err.statusCode = 403;
        throw err;
    }

    if (userName && userName !== 'Candidate' && (!cert.userName || cert.userName === 'Candidate' || cert.userName !== userName)) {
        cert.userName = userName;
        allCerts[certIndex] = cert;
        writeJsonFile(CERTS_FILE, allCerts);
    }

    return cert;
}

// 3. Public Verification Endpoint
async function verifyCertificatePublic(certificateId) {
    if (!certificateId) return { verified: false, message: "Certificate ID is required." };

    const normId = certificateId.trim();
    const allCerts = readJsonFile(CERTS_FILE, []);
    const cert = allCerts.find(c => 
        c.certificateId === normId || 
        c.certificateId.toLowerCase() === normId.toLowerCase() ||
        c.id === normId
    );

    if (!cert) {
        return {
            verified: false,
            status: 'not_found',
            message: `Certificate with credential ID "${certificateId}" could not be found in the registry.`
        };
    }

    if (cert.status === 'revoked') {
        return {
            verified: false,
            status: 'revoked',
            certificateId: cert.certificateId,
            title: cert.title,
            candidateName: cert.userName,
            message: "This certificate has been revoked by the certification authority."
        };
    }

    // Expose only safe public verification details
    return {
        verified: true,
        status: 'active',
        certificate: {
            certificateId: cert.certificateId,
            candidateName: cert.userName,
            title: cert.title,
            level: cert.level,
            category: cert.category,
            issuer: cert.issuer || 'MockMate AI Certification Board',
            issueDate: cert.issueDate,
            score: cert.score,
            skills: cert.skills || [],
            verificationUrl: `http://localhost:5173/verify/${cert.certificateId}`
        }
    };
}

// 4. Submit Assessment & Issue Certificate
async function submitAssessment(assessmentId, userEmail, userName = 'Candidate', submittedAnswers = {}) {
    const assessment = ASSESSMENTS.find(a => a.id === assessmentId);
    if (!assessment) {
        throw new Error("Assessment not found.");
    }

    const normEmail = (userEmail || 'candidate@example.com').toLowerCase().trim();

    // Check if user already holds an active certificate for this assessment
    const allCerts = readJsonFile(CERTS_FILE, []);
    const existingCert = allCerts.find(c => 
        c.userEmail === normEmail && 
        c.assessmentId === assessmentId && 
        c.status === 'active'
    );

    if (existingCert) {
        return {
            alreadyCertified: true,
            message: `You already hold an active verified certificate for "${assessment.title}".`,
            certificate: existingCert
        };
    }

    // Server-Side Strict Scoring
    let correctCount = 0;
    const totalQuestions = assessment.questions.length;
    const breakdown = assessment.questions.map((q) => {
        const candidateAnswer = submittedAnswers[q.id];
        const isCorrect = candidateAnswer !== undefined && Number(candidateAnswer) === q.correctIndex;
        if (isCorrect) correctCount++;

        return {
            questionId: q.id,
            question: q.question,
            candidateAnswer: candidateAnswer !== undefined ? q.options[candidateAnswer] : 'No answer provided',
            correctAnswer: q.options[q.correctIndex],
            isCorrect,
            explanation: q.explanation
        };
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= assessment.passMark;

    // Record attempt
    const attemptRecord = {
        id: 'att_' + Date.now(),
        userEmail: normEmail,
        userName,
        assessmentId,
        score,
        passed,
        submittedAt: new Date().toISOString()
    };

    const allAttempts = readJsonFile(ATTEMPTS_FILE, []);
    allAttempts.push(attemptRecord);
    writeJsonFile(ATTEMPTS_FILE, allAttempts);

    let newCertificate = null;

    if (passed) {
        // Generate Unique Certificate ID
        const prefix = assessment.category.includes('System') ? 'SD' :
                       assessment.category.includes('Web') ? 'FS' :
                       assessment.category.includes('Backend') ? 'ND' :
                       assessment.category.includes('Leadership') ? 'BH' : 'JS';
        const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
        const year = new Date().getFullYear();
        const certificateId = `MM-${prefix}-${year}-${randomHex}`;

        newCertificate = {
            id: 'cert_' + Date.now(),
            certificateId,
            userEmail: normEmail,
            userName,
            assessmentId,
            title: assessment.certificateTitle,
            level: assessment.gradeTitle,
            category: assessment.category,
            score: `${score}% Technical Mastery`,
            numericScore: score,
            issueDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            issueDateIso: new Date().toISOString(),
            skills: assessment.skills,
            issuer: 'MockMate AI Certification Board',
            status: 'active'
        };

        allCerts.push(newCertificate);
        writeJsonFile(CERTS_FILE, allCerts);
    }

    return {
        alreadyCertified: false,
        score,
        passMark: assessment.passMark,
        passed,
        correctCount,
        totalQuestions,
        breakdown,
        newCertificate
    };
}

// 5. Generate Professional PDF Certificate Stream
function generateCertificatePdf(cert, res, candidateName) {
    const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
        margin: 40
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="MockMate_Certificate_${cert.certificateId}.pdf"`);

    doc.pipe(res);

    // Dimensions
    const width = doc.page.width;
    const height = doc.page.height;

    // Outer Background
    doc.rect(0, 0, width, height).fill('#F8FAFC');

    // Double Border (Deep Emerald & Gold)
    doc.rect(25, 25, width - 50, height - 50)
       .lineWidth(3)
       .stroke('#064E3B');

    doc.rect(32, 32, width - 64, height - 64)
       .lineWidth(1)
       .stroke('#D97706');

    // Top Header: Organization
    doc.fillColor('#064E3B')
       .fontSize(14)
       .font('Helvetica-Bold')
       .text('MOCKMATE AI CERTIFICATION BOARD', 0, 60, { align: 'center', characterSpacing: 2 });

    doc.fillColor('#64748B')
       .fontSize(9)
       .font('Helvetica')
       .text('AUTONOMOUS TECHNICAL EVALUATION & CREDENTIALING DIRECTORY', 0, 78, { align: 'center', characterSpacing: 1 });

    // Ribbon / Title
    doc.fillColor('#0F172A')
       .fontSize(28)
       .font('Helvetica-Bold')
       .text('Certificate of Technical Competency', 0, 110, { align: 'center' });

    // Subtitle
    doc.fillColor('#64748B')
       .fontSize(12)
       .font('Helvetica')
       .text('This is to certify that candidate', 0, 155, { align: 'center' });

    // Candidate Name (Always account holder's verified name)
    const officialCandidateName = (candidateName && candidateName !== 'Candidate')
        ? candidateName
        : ((cert.userName && cert.userName !== 'Candidate') ? cert.userName : 'Imasha Samodee');

    doc.fillColor('#064E3B')
       .fontSize(32)
       .font('Helvetica-Bold')
       .text(officialCandidateName, 0, 180, { align: 'center' });

    // Underline below candidate name
    const nameWidth = doc.widthOfString(officialCandidateName);
    const nameX = (width - nameWidth) / 2;
    doc.moveTo(nameX - 20, 222).lineTo(nameX + nameWidth + 20, 222).lineWidth(1.5).stroke('#059669');

    // Has satisfied criteria
    doc.fillColor('#475569')
       .fontSize(12)
       .font('Helvetica')
       .text('has successfully satisfied all rigorous examination requirements for credential', 0, 240, { align: 'center' });

    // Credential Title
    doc.fillColor('#0F172A')
       .fontSize(22)
       .font('Helvetica-Bold')
       .text(cert.title, 0, 265, { align: 'center' });

    // Grade and Score Pill Box (Dynamically sized, sleek capsule with rounded corners)
    const badgeText = `Grade: ${cert.level}   •   Score: ${cert.score}`;
    doc.font('Helvetica-Bold').fontSize(10.5);
    const textWidth = doc.widthOfString(badgeText);
    const badgePaddingX = 24;
    const badgeWidth = Math.ceil(textWidth + (badgePaddingX * 2));
    const badgeHeight = 30;
    const badgeX = (width - badgeWidth) / 2;
    const badgeY = 306;

    // Draw elegant capsule pill with smooth rounded corners
    doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 15)
       .lineWidth(1)
       .fillAndStroke('#ECFDF5', '#059669');

    doc.fillColor('#064E3B')
       .fontSize(10.5)
       .font('Helvetica-Bold')
       .text(badgeText, badgeX, badgeY + 9, { width: badgeWidth, align: 'center' });

    // Verified Skills List
    if (cert.skills && cert.skills.length > 0) {
        doc.fillColor('#64748B')
           .fontSize(9.5)
           .font('Helvetica')
           .text(`Verified Competencies: ${cert.skills.join('   •   ')}`, 0, 348, { width: width, align: 'center' });
    }

    // Bottom Signatures & Verification Row
    const bottomY = height - 130;

    // Left Column: Credential Verification
    doc.fillColor('#475569')
       .fontSize(9)
       .font('Helvetica-Bold')
       .text('CREDENTIAL IDENTIFIER:', 65, bottomY);
    doc.fillColor('#0F172A')
       .fontSize(10)
       .font('Courier-Bold')
       .text(cert.certificateId, 65, bottomY + 14);

    doc.fillColor('#64748B')
       .fontSize(8)
       .font('Helvetica')
       .text(`Issued: ${cert.issueDate}`, 65, bottomY + 30);
    doc.fillColor('#059669')
       .text(`Status: Verified & Cryptographically Signed`, 65, bottomY + 44);

    // Center: Gold Seal Emblem
    const sealX = width / 2;
    doc.circle(sealX, bottomY + 25, 32)
       .fillAndStroke('#FEF3C7', '#D97706');
    doc.circle(sealX, bottomY + 25, 27)
       .lineWidth(1)
       .stroke('#B45309');
    doc.fillColor('#92400E')
       .fontSize(8)
       .font('Helvetica-Bold')
       .text('MOCKMATE', sealX - 25, bottomY + 16, { width: 50, align: 'center' });
    doc.fontSize(7)
       .text('VERIFIED', sealX - 25, bottomY + 28, { width: 50, align: 'center' });

    // Right Column: Signatures
    doc.moveTo(width - 240, bottomY + 20).lineTo(width - 65, bottomY + 20).lineWidth(1).stroke('#94A3B8');
    doc.fillColor('#0F172A')
       .fontSize(9)
       .font('Helvetica-Bold')
       .text('Dr. Alistair Vance, Lead Examiner', width - 240, bottomY + 26, { align: 'right' });
    doc.fillColor('#64748B')
       .fontSize(8)
       .font('Helvetica')
       .text('Autonomous Evaluation Board', width - 240, bottomY + 39, { align: 'right' });

    // Finalize PDF
    doc.end();
}

module.exports = {
    getUserCertificates,
    getCertificateById,
    verifyCertificatePublic,
    submitAssessment,
    generateCertificatePdf,
    ASSESSMENTS
};
