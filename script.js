// Show tutorial modal
function showTutorial(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

// Close tutorial modal
function closeTutorial(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Handle form submission for Client Step 1
document.getElementById('client-step1-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Save form data to localStorage (temporary storage)
    const formData = {
        projectName: document.getElementById('project-name').value,
        clientName: document.getElementById('client-name').value,
        location: document.getElementById('location').value,
        startDate: document.getElementById('start-date').value,
        endDate: document.getElementById('end-date').value
    };
    localStorage.setItem('clientData', JSON.stringify(formData));
    window.location.href = 'client-step2.html';
});
// Update risk table preview
document.querySelectorAll('input[name="hazards"]').forEach(checkbox => {
    checkbox.addEventListener('change', updateRiskTable);
});

function updateRiskTable() {
    const tableBody = document.getElementById('risk-table-body');
    tableBody.innerHTML = '';
    const controls = {
        'Electrical': 'Qualified electricians only',
        'Heights': 'Fall protection required',
        'Dust': 'Ventilation, PPE'
    };
    document.querySelectorAll('input[name="hazards"]:checked').forEach(checkbox => {
        const hazard = checkbox.value;
        const row = document.createElement('tr');
        row.innerHTML = `<td>${hazard}</td><td>${controls[hazard]}</td>`;
        tableBody.appendChild(row);
    });
}

// Handle form submission for Client Step 2
document.getElementById('client-step2-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const hazards = Array.from(document.querySelectorAll('input[name="hazards"]:checked')).map(cb => cb.value);
    const otherHazards = document.getElementById('other-hazards').value;
    const clientData = JSON.parse(localStorage.getItem('clientData')) || {};
    clientData.hazards = hazards;
    clientData.otherHazards = otherHazards;
    localStorage.setItem('clientData', JSON.stringify(clientData));
    window.location.href = 'client-step3.html';
});
// Handle form submission for Client Step 3
document.getElementById('client-step3-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const ppe = Array.from(document.querySelectorAll('input[name="ppe"]:checked')).map(cb => cb.value);
    const procedures = document.getElementById('procedures').value;
    const docs = Array.from(document.querySelectorAll('input[name="docs"]:checked')).map(cb => cb.value);
    const clientData = JSON.parse(localStorage.getItem('clientData')) || {};
    clientData.ppe = ppe;
    clientData.procedures = procedures;
    clientData.docs = docs;
    localStorage.setItem('clientData', JSON.stringify(clientData));
    window.location.href = 'client-step4.html';
});
// Handle form submission for Client Step 4
document.getElementById('client-step4-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const contractorName = document.getElementById('contractor-name').value;
    const agreementTerms = document.getElementById('agreement-terms').value;
    const clientData = JSON.parse(localStorage.getItem('clientData')) || {};
    clientData.contractorName = contractorName;
    clientData.agreementTerms = agreementTerms;
    localStorage.setItem('clientData', JSON.stringify(clientData));
    window.location.href = 'client-output.html';
});
// Client Output - Generate PDFs
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('client-output.html')) {
        const clientData = JSON.parse(localStorage.getItem('clientData'));
        const { jsPDF } = window.jspdf;

        // Health and Safety Specifications
        document.getElementById('specs-link').addEventListener('click', function(e) {
            e.preventDefault();
            const doc = new jsPDF();
            doc.text('Health and Safety Specifications', 10, 10);
            doc.text(`Project: ${clientData.projectName}`, 10, 20);
            doc.text(`Client: ${clientData.clientName}`, 10, 30);
            doc.text(`Location: ${clientData.location}`, 10, 40);
            doc.text(`Duration: ${clientData.startDate} to ${clientData.endDate}`, 10, 50);
            doc.text(`Mandatory PPE: ${clientData.ppe.join(', ')}`, 10, 60);
            doc.text(`Safety Procedures: ${clientData.procedures}`, 10, 70);
            doc.text(`Compliance Docs: ${clientData.docs.join(', ')}`, 10, 80);
            doc.save('specifications.pdf');
        });

        // Baseline Risk Assessment
        document.getElementById('risk-link').addEventListener('click', function(e) {
            e.preventDefault();
            const doc = new jsPDF();
            doc.text('Baseline Risk Assessment', 10, 10);
            doc.text(`Project: ${clientData.projectName}`, 10, 20);
            doc.text(`Hazards: ${clientData.hazards.join(', ')}`, 10, 30);
            if (clientData.otherHazards) {
                doc.text(`Other Hazards: ${clientData.otherHazards}`, 10, 40);
            }
            doc.save('risk-assessment.pdf');
        });

        // Section 37 Agreement
        document.getElementById('agreement-link').addEventListener('click', function(e) {
            e.preventDefault();
            const doc = new jsPDF();
            doc.text('Section 37 Agreement', 10, 10);
            doc.text(`Contractor: ${clientData.contractorName}`, 10, 20);
            doc.text(`Terms: ${clientData.agreementTerms}`, 10, 30);
            doc.save('agreement.pdf');
        });
    }
});

function saveToDashboard() {
    window.location.href = 'dashboard.html';
}
// Handle form submission for Contractor Step 1
document.getElementById('contractor-step1-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
        projectName: document.getElementById('project-name').value,
        clientName: document.getElementById('client-name').value,
        contractorName: document.getElementById('contractor-name').value,
        location: document.getElementById('location').value,
        startDate: document.getElementById('start-date').value,
        endDate: document.getElementById('end-date').value
    };
    localStorage.setItem('contractorData', JSON.stringify(formData));
    window.location.href = 'contractor-step2.html';
});
// Handle form submission for Contractor Step 2
document.getElementById('contractor-step2-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('spec-file');
    const clientHazards = document.getElementById('client-hazards').value;
    const clientPpe = document.getElementById('client-ppe').value;
    const clientDocs = document.getElementById('client-docs').value;

    const formData = JSON.parse(localStorage.getItem('contractorData')) || {};
    formData.clientHazards = clientHazards;
    formData.clientPpe = clientPpe;
    formData.clientDocs = clientDocs;
    // For MVP, we won't process the file upload; we'll simulate it
    formData.specFile = fileInput.files.length > 0 ? fileInput.files[0].name : '';
    localStorage.setItem('contractorData', JSON.stringify(formData));
    window.location.href = 'contractor-step3.html';
});
// Update risk table preview for Contractor Step 3
document.querySelectorAll('input[name="hazards"]').forEach(checkbox => {
    checkbox.addEventListener('change', updateContractorRiskTable);
});

function updateContractorRiskTable() {
    const tableBody = document.getElementById('risk-table-body');
    tableBody.innerHTML = '';
    const controls = {
        'Electrical': 'Qualified Electricians',
        'Heights': 'Harnesses',
        'Dust': 'PPE and Ventilation'
    };
    document.querySelectorAll('input[name="hazards"]:checked').forEach(checkbox => {
        const hazard = checkbox.value;
        const row = document.createElement('tr');
        row.innerHTML = `<td>${hazard}</td><td>${controls[hazard]}</td>`;
        tableBody.appendChild(row);
    });
}

// Handle form submission for Contractor Step 3
document.getElementById('contractor-step3-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const activities = document.getElementById('activities').value;
    const hazards = Array.from(document.querySelectorAll('input[name="hazards"]:checked')).map(cb => cb.value);
    const controls = document.getElementById('controls').value;
    const subcontractors = document.getElementById('subcontractors').value;

    const formData = JSON.parse(localStorage.getItem('contractorData')) || {};
    formData.activities = activities;
    formData.hazards = hazards;
    formData.controls = controls;
    formData.subcontractors = subcontractors;
    localStorage.setItem('contractorData', JSON.stringify(formData));
    window.location.href = 'contractor-step4.html';
});
// Handle form submission for Contractor Step 4
document.getElementById('contractor-step4-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const chsOfficer = document.getElementById('chs-officer').value;
    const firstAider = document.getElementById('first-aider').value;
    const hsRep = document.getElementById('hs-rep').value;

    const formData = JSON.parse(localStorage.getItem('contractorData')) || {};
    formData.chsOfficer = chsOfficer;
    formData.firstAider = firstAider;
    formData.hsRep = hsRep;
    localStorage.setItem('contractorData', JSON.stringify(formData));
    window.location.href = 'contractor-step5.html';
});