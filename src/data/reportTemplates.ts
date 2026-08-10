

import { ReportCategory, LabReportParameter } from '../types';

export interface TestTemplate {
  id: string;
  category: ReportCategory;
  testName: string;
  defaultParameters: Omit<LabReportParameter, 'id'>[];
  defaultImpression?: string;
  defaultRecommendations?: string;
}

export const TEST_TEMPLATES: TestTemplate[] = [
  // BLOOD TESTS
  {
    id: 'blood-cbc',
    category: 'Blood Test',
    testName: 'Complete Blood Count (CBC)',
    defaultParameters: [
      { name: 'Hemoglobin (Hb)', value: '14.2', unit: 'g/dL', normalRange: '12.0 - 16.0', flag: 'Normal' },
      { name: 'Total WBC Count', value: '7,500', unit: '/mcL', normalRange: '4,500 - 11,000', flag: 'Normal' },
      { name: 'Total RBC Count', value: '4.8', unit: 'million/mcL', normalRange: '4.2 - 5.4', flag: 'Normal' },
      { name: 'Platelet Count', value: '250,000', unit: '/mcL', normalRange: '150,000 - 450,000', flag: 'Normal' },
      { name: 'Hematocrit (HCT)', value: '42', unit: '%', normalRange: '37 - 48', flag: 'Normal' },
      { name: 'MCV', value: '88', unit: 'fL', normalRange: '80 - 100', flag: 'Normal' },
      { name: 'Neutrophils', value: '62', unit: '%', normalRange: '40 - 70', flag: 'Normal' },
      { name: 'Lymphocytes', value: '30', unit: '%', normalRange: '20 - 40', flag: 'Normal' }
    ],
    defaultImpression: 'Normal Complete Blood Count panel with adequate cell lines and hemoglobin level.',
    defaultRecommendations: 'Routine follow-up as clinically indicated.'
  },
  {
    id: 'blood-lipid',
    category: 'Blood Test',
    testName: 'Lipid Profile',
    defaultParameters: [
      { name: 'Total Cholesterol', value: '190', unit: 'mg/dL', normalRange: '< 200', flag: 'Normal' },
      { name: 'HDL Cholesterol (Good)', value: '52', unit: 'mg/dL', normalRange: '> 40', flag: 'Normal' },
      { name: 'LDL Cholesterol (Bad)', value: '110', unit: 'mg/dL', normalRange: '< 100', flag: 'High' },
      { name: 'Triglycerides', value: '140', unit: 'mg/dL', normalRange: '< 150', flag: 'Normal' },
      { name: 'VLDL Cholesterol', value: '28', unit: 'mg/dL', normalRange: '5 - 30', flag: 'Normal' },
      { name: 'TC / HDL Ratio', value: '3.65', unit: 'Ratio', normalRange: '< 4.5', flag: 'Normal' }
    ],
    defaultImpression: 'Lipid panel demonstrates mild elevation in LDL cholesterol.',
    defaultRecommendations: 'Recommend therapeutic lifestyle changes, low-fat diet, and regular exercise.'
  },
  {
    id: 'blood-lft',
    category: 'Blood Test',
    testName: 'Liver Function Test (LFT)',
    defaultParameters: [
      { name: 'ALT / SGPT', value: '28', unit: 'U/L', normalRange: '7 - 56', flag: 'Normal' },
      { name: 'AST / SGOT', value: '24', unit: 'U/L', normalRange: '10 - 40', flag: 'Normal' },
      { name: 'Alkaline Phosphatase (ALP)', value: '68', unit: 'U/L', normalRange: '44 - 147', flag: 'Normal' },
      { name: 'Total Bilirubin', value: '0.8', unit: 'mg/dL', normalRange: '0.2 - 1.2', flag: 'Normal' },
      { name: 'Direct Bilirubin', value: '0.2', unit: 'mg/dL', normalRange: '0.0 - 0.3', flag: 'Normal' },
      { name: 'Total Protein', value: '7.1', unit: 'g/dL', normalRange: '6.0 - 8.3', flag: 'Normal' },
      { name: 'Serum Albumin', value: '4.2', unit: 'g/dL', normalRange: '3.5 - 5.0', flag: 'Normal' }
    ],
    defaultImpression: 'Hepatic panel within normal physiological limits.',
    defaultRecommendations: 'No acute hepatic dysfunction detected.'
  },
  {
    id: 'blood-kft',
    category: 'Blood Test',
    testName: 'Kidney Function Test (KFT)',
    defaultParameters: [
      { name: 'Blood Urea Nitrogen (BUN)', value: '14', unit: 'mg/dL', normalRange: '7 - 20', flag: 'Normal' },
      { name: 'Serum Creatinine', value: '0.9', unit: 'mg/dL', normalRange: '0.6 - 1.2', flag: 'Normal' },
      { name: 'eGFR', value: '95', unit: 'mL/min/1.73m²', normalRange: '> 90', flag: 'Normal' },
      { name: 'Uric Acid', value: '5.2', unit: 'mg/dL', normalRange: '3.5 - 7.2', flag: 'Normal' },
      { name: 'Sodium (Na+)', value: '139', unit: 'mEq/L', normalRange: '135 - 145', flag: 'Normal' },
      { name: 'Potassium (K+)', value: '4.2', unit: 'mEq/L', normalRange: '3.5 - 5.0', flag: 'Normal' }
    ],
    defaultImpression: 'Normal renal clearance and electrolyte balance.',
    defaultRecommendations: 'Maintain adequate oral hydration.'
  },
  {
    id: 'blood-thyroid',
    category: 'Blood Test',
    testName: 'Thyroid Profile (T3, T4, TSH)',
    defaultParameters: [
      { name: 'TSH (Thyroid Stimulating Hormone)', value: '2.1', unit: 'mIU/L', normalRange: '0.4 - 4.0', flag: 'Normal' },
      { name: 'Free T3', value: '3.1', unit: 'pg/mL', normalRange: '2.0 - 4.4', flag: 'Normal' },
      { name: 'Free T4', value: '1.3', unit: 'ng/dL', normalRange: '0.8 - 1.8', flag: 'Normal' }
    ],
    defaultImpression: 'Euthyroid state. Thyroid hormone levels within reference limits.',
    defaultRecommendations: 'Repeat profile annually or if clinical symptoms develop.'
  },
  {
    id: 'blood-diabetes',
    category: 'Blood Test',
    testName: 'Blood Glucose & HbA1c Panel',
    defaultParameters: [
      { name: 'Fasting Blood Sugar (FBS)', value: '92', unit: 'mg/dL', normalRange: '70 - 99', flag: 'Normal' },
      { name: 'Postprandial Glucose (2hr PP)', value: '128', unit: 'mg/dL', normalRange: '< 140', flag: 'Normal' },
      { name: 'HbA1c (Glycated Hemoglobin)', value: '5.4', unit: '%', normalRange: '4.0 - 5.6', flag: 'Normal' }
    ],
    defaultImpression: 'Normal glycemic control. No indication of impaired glucose tolerance or diabetes.',
    defaultRecommendations: 'Continue balanced dietary habits and physical activity.'
  },

  // X-RAY TESTS
  {
    id: 'xray-chest',
    category: 'X-Ray',
    testName: 'Chest X-Ray PA View',
    defaultParameters: [
      { name: 'Lungs & Pleura', value: 'Clear lung fields without consolidation, pneumothorax, or effusion', unit: 'N/A', normalRange: 'Clear lung fields', flag: 'Normal' },
      { name: 'Cardiac Silhouette', value: 'Normal size and cardiac contour (CTI < 0.5)', unit: 'N/A', normalRange: 'Normal CTI < 0.5', flag: 'Normal' },
      { name: 'Mediastinum & Hila', value: 'Centrally positioned mediastinum, normal vascular markings', unit: 'N/A', normalRange: 'Normal', flag: 'Normal' },
      { name: 'Bony Thorax', value: 'Visualized bony thorax intact, no acute rib fractures', unit: 'N/A', normalRange: 'Intact', flag: 'Normal' }
    ],
    defaultImpression: 'Normal PA Chest Radiograph without evidence of acute cardiopulmonary pathology.',
    defaultRecommendations: 'Correlate with clinical examination.'
  },
  {
    id: 'xray-lumbar',
    category: 'X-Ray',
    testName: 'Lumbar Spine X-Ray (AP/Lateral)',
    defaultParameters: [
      { name: 'Vertebral Alignment', value: 'Normal lordotic curve maintained without listhesis', unit: 'N/A', normalRange: 'Normal alignment', flag: 'Normal' },
      { name: 'Vertebral Body Heights', value: 'Preserved heights across L1-L5 without fracture', unit: 'N/A', normalRange: 'Preserved height', flag: 'Normal' },
      { name: 'Intervertebral Disc Spaces', value: 'Mild narrowing noted at L4-L5 disc space', unit: 'N/A', normalRange: 'Preserved disc spaces', flag: 'Abnormal' },
      { name: 'Sacroiliac Joints', value: 'Bilateral SI joints appear unremarkable', unit: 'N/A', normalRange: 'Unremarkable', flag: 'Normal' }
    ],
    defaultImpression: 'Mild L4-L5 intervertebral disc space narrowing suggesting mild degenerative disc disease.',
    defaultRecommendations: 'Physical therapy and posture management advised if symptomatic.'
  },

  // CT SCAN TESTS
  {
    id: 'ct-head',
    category: 'CT Scan',
    testName: 'Brain / Head CT Scan (Non-Contrast)',
    defaultParameters: [
      { name: 'Brain Parenchyma', value: 'Normal attenuation, no acute infarction or intracranial hemorrhage', unit: 'N/A', normalRange: 'Normal attenuation', flag: 'Normal' },
      { name: 'Ventricles & Cisterns', value: 'Normal size, position, and configuration for age', unit: 'N/A', normalRange: 'Normal size/shape', flag: 'Normal' },
      { name: 'Midline Structures', value: 'Midline structures remain strictly centered without mass effect', unit: 'N/A', normalRange: 'No midline shift', flag: 'Normal' },
      { name: 'Calvarium & Skull Base', value: 'No evidence of acute calvarial fracture or lytic lesion', unit: 'N/A', normalRange: 'Intact', flag: 'Normal' }
    ],
    defaultImpression: 'Unremarkable non-contrast head CT scan. No intracranial bleed or acute territorial ischemia.',
    defaultRecommendations: 'Clinical correlation advised.'
  },
  {
    id: 'ct-chest',
    category: 'CT Scan',
    testName: 'HRCT Chest (High-Resolution)',
    defaultParameters: [
      { name: 'Lung Parenchyma', value: 'No pulmonary nodules, bronchiectasis, or ground-glass opacities', unit: 'N/A', normalRange: 'Clear lung parenchyma', flag: 'Normal' },
      { name: 'Pleural Spaces', value: 'No pleural effusion or thickening bilaterally', unit: 'N/A', normalRange: 'No effusion', flag: 'Normal' },
      { name: 'Mediastinal Lymph Nodes', value: 'No pathologically enlarged lymph nodes noted', unit: 'N/A', normalRange: '< 10mm short axis', flag: 'Normal' }
    ],
    defaultImpression: 'High-resolution CT of chest shows clear lungs without parenchymal lung disease.',
    defaultRecommendations: 'Follow-up as per physician request.'
  },

  // MRI TESTS
  {
    id: 'mri-brain',
    category: 'MRI',
    testName: 'Brain MRI with Contrast',
    defaultParameters: [
      { name: 'Brain Signal Intensity', value: 'No localized abnormal T1/T2 hyperintensity in cerebral hemispheres', unit: 'N/A', normalRange: 'Normal signal intensity', flag: 'Normal' },
      { name: 'Ventricular System', value: 'Ventricles and sulcal pattern within age-appropriate limits', unit: 'N/A', normalRange: 'Age-appropriate', flag: 'Normal' },
      { name: 'Post-Contrast Enhancement', value: 'No pathological meningeal or parenchymal enhancement', unit: 'N/A', normalRange: 'No abnormal enhancement', flag: 'Normal' }
    ],
    defaultImpression: 'Normal Brain MRI study without intracranial mass, acute ischemia, or abnormal enhancement.',
    defaultRecommendations: 'Routine follow-up.'
  },
  {
    id: 'mri-spine',
    category: 'MRI',
    testName: 'Lumbar Spine MRI',
    defaultParameters: [
      { name: 'L1-L3 Discs', value: 'Normal disc height and hydration, no posterior protrusion', unit: 'N/A', normalRange: 'Normal', flag: 'Normal' },
      { name: 'L4-L5 Disc', value: 'Mild central disc bulge without significant spinal canal stenosis', unit: 'N/A', normalRange: 'No bulge', flag: 'Abnormal' },
      { name: 'Conus Medullaris', value: 'Terminates normally at L1 level with normal signal', unit: 'N/A', normalRange: 'Normal termination L1-L2', flag: 'Normal' }
    ],
    defaultImpression: 'Mild central L4-L5 disc protrusion without severe canal compromise.',
    defaultRecommendations: 'Conservative clinical management.'
  },

  // URINE ANALYSIS
  {
    id: 'urine-routine',
    category: 'Urine Analysis',
    testName: 'Routine Urine Examination',
    defaultParameters: [
      { name: 'Color & Clarity', value: 'Pale Yellow / Clear', unit: 'N/A', normalRange: 'Pale Yellow / Clear', flag: 'Normal' },
      { name: 'Specific Gravity', value: '1.018', unit: 'g/mL', normalRange: '1.005 - 1.030', flag: 'Normal' },
      { name: 'pH', value: '6.2', unit: 'pH', normalRange: '4.6 - 8.0', flag: 'Normal' },
      { name: 'Protein / Albumin', value: 'Negative', unit: 'N/A', normalRange: 'Negative', flag: 'Normal' },
      { name: 'Glucose', value: 'Negative', unit: 'N/A', normalRange: 'Negative', flag: 'Normal' },
      { name: 'Ketones', value: 'Negative', unit: 'N/A', normalRange: 'Negative', flag: 'Normal' },
      { name: 'Microscopic WBCs', value: '1-2', unit: '/hpf', normalRange: '0 - 5', flag: 'Normal' },
      { name: 'Microscopic RBCs', value: '0-1', unit: '/hpf', normalRange: '0 - 2', flag: 'Normal' }
    ],
    defaultImpression: 'Unremarkable urine analysis. No evidence of urinary tract infection or proteinuria.',
    defaultRecommendations: 'Continue general hydration.'
  },

  // ULTRASOUND
  {
    id: 'ultrasound-abdomen',
    category: 'Ultrasound',
    testName: 'Whole Abdomen Ultrasound',
    defaultParameters: [
      { name: 'Liver', value: 'Normal size and echotexture without focal parenchymal lesions', unit: 'N/A', normalRange: 'Normal size/echotexture', flag: 'Normal' },
      { name: 'Gallbladder', value: 'Normal wall thickness, no calculi or acoustic shadowing', unit: 'N/A', normalRange: 'No calculi', flag: 'Normal' },
      { name: 'Kidneys', value: 'Bilateral kidneys of normal size with preserved corticomedullary differentiation', unit: 'N/A', normalRange: 'Normal size', flag: 'Normal' },
      { name: 'Urinary Bladder', value: 'Well filled, smooth wall, no lumen abnormality', unit: 'N/A', normalRange: 'Smooth wall', flag: 'Normal' }
    ],
    defaultImpression: 'Unremarkable whole abdominal ultrasound scan.',
    defaultRecommendations: 'Clinical correlation.'
  }
];

export const getTemplatesByCategory = (category: ReportCategory): TestTemplate[] => {
  return TEST_TEMPLATES.filter(t => t.category === category);
};
