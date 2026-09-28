const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Medicine = require('./models/Medicine');
const DeliveryArea = require('./models/DeliveryArea');
const Pincode = require('./models/Pincode');
const BusinessApplication = require('./models/BusinessApplication');
const Order = require('./models/Order');
const Invoice = require('./models/Invoice');
const Cart = require('./models/Cart');
const DeliveryAssignment = require('./models/DeliveryAssignment');

const seedAllData = async () => {
  try {
    console.log('Seeding initial wholesale pharmaceutical dataset...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Medicine.deleteMany({}),
      DeliveryArea.deleteMany({}),
      Pincode.deleteMany({}),
      BusinessApplication.deleteMany({}),
      Order.deleteMany({}),
      Invoice.deleteMany({}),
      Cart.deleteMany({}),
      DeliveryAssignment.deleteMany({}),
    ]);

    // 1. Create Delivery Areas
    const erodeArea = await DeliveryArea.create({
      name: 'Erode Central & Suburbs',
      district: 'Erode',
      state: 'Tamil Nadu',
      description: 'Headquarters primary service region with dedicated cold chain vans and express same-day wholesale dispatch.',
      hubAddress: '50, 1st Floor, Kamaraj Street, Erode - 638001',
      contactPhone: '9994446994',
      estimatedDeliveryTime: 'Same Day (Within 4-8 Hours)',
      isActive: true,
    });

    const karurArea = await DeliveryArea.create({
      name: 'Karur Industrial & Medical Corridor',
      district: 'Karur',
      state: 'Tamil Nadu',
      description: 'Scheduled daily bulk replenishment circuit for retail pharmacies and nursing homes in Karur.',
      hubAddress: 'Kovai Road Distribution Point, Karur - 639002',
      contactPhone: '9865730150',
      estimatedDeliveryTime: 'Next Morning (12-24 Hours)',
      isActive: true,
    });

    const namakkalArea = await DeliveryArea.create({
      name: 'Namakkal Healthcare Hub',
      district: 'Namakkal',
      state: 'Tamil Nadu',
      description: 'Daily transit route connecting medical stores across Namakkal and Rasipuram.',
      hubAddress: 'Salem Main Road Junction, Namakkal - 637001',
      contactPhone: '9994446994',
      estimatedDeliveryTime: 'Next Morning (12-24 Hours)',
      isActive: true,
    });

    const salemArea = await DeliveryArea.create({
      name: 'Salem Metro & Hospital Zone',
      district: 'Salem',
      state: 'Tamil Nadu',
      description: 'Specialist hospital supplies and bulk wholesale pharmacy distribution in Salem district.',
      hubAddress: 'Junction Main Road, Meyyanur, Salem - 636004',
      contactPhone: '9865730150',
      estimatedDeliveryTime: 'Same Day / Next Morning',
      isActive: true,
    });

    // 2. Create Pincodes for Service Areas
    const pincodesList = [
      // Erode
      { pincode: '638001', areaName: 'Erode Fort / Kamaraj St (HQ)', district: 'Erode', deliveryArea: erodeArea._id, deliveryAreaName: erodeArea.name, estimatedDeliveryDays: 1, isActive: true },
      { pincode: '638002', areaName: 'Brough Road / Market', district: 'Erode', deliveryArea: erodeArea._id, deliveryAreaName: erodeArea.name, estimatedDeliveryDays: 1, isActive: true },
      { pincode: '638009', areaName: 'Perundurai Road Medical Enclave', district: 'Erode', deliveryArea: erodeArea._id, deliveryAreaName: erodeArea.name, estimatedDeliveryDays: 1, isActive: true },
      { pincode: '638011', areaName: 'Surampatti / Solar Bypass', district: 'Erode', deliveryArea: erodeArea._id, deliveryAreaName: erodeArea.name, estimatedDeliveryDays: 1, isActive: true },
      { pincode: '638052', areaName: 'Perundurai SIPCOT & Hospital Zone', district: 'Erode', deliveryArea: erodeArea._id, deliveryAreaName: erodeArea.name, estimatedDeliveryDays: 1, isActive: true },
      { pincode: '638401', areaName: 'Gobichettipalayam Town', district: 'Erode', deliveryArea: erodeArea._id, deliveryAreaName: erodeArea.name, estimatedDeliveryDays: 1, isActive: true },
      { pincode: '638501', areaName: 'Bhavani River Bridge Zone', district: 'Erode', deliveryArea: erodeArea._id, deliveryAreaName: erodeArea.name, estimatedDeliveryDays: 1, isActive: true },
      
      // Karur
      { pincode: '639001', areaName: 'Karur Bus Stand / Jawahar Bazaar', district: 'Karur', deliveryArea: karurArea._id, deliveryAreaName: karurArea.name, estimatedDeliveryDays: 1, isActive: true },
      { pincode: '639002', areaName: 'Thanthonimalai Medical College Area', district: 'Karur', deliveryArea: karurArea._id, deliveryAreaName: karurArea.name, estimatedDeliveryDays: 1, isActive: true },
      { pincode: '639117', areaName: 'Kulithalai Town', district: 'Karur', deliveryArea: karurArea._id, deliveryAreaName: karurArea.name, estimatedDeliveryDays: 2, isActive: true },

      // Namakkal
      { pincode: '637001', areaName: 'Namakkal Fort & Bus Stand', district: 'Namakkal', deliveryArea: namakkalArea._id, deliveryAreaName: namakkalArea.name, estimatedDeliveryDays: 1, isActive: true },
      { pincode: '637211', areaName: 'Tiruchengode Temple Town', district: 'Namakkal', deliveryArea: namakkalArea._id, deliveryAreaName: namakkalArea.name, estimatedDeliveryDays: 1, isActive: true },
      { pincode: '637408', areaName: 'Rasipuram Market Hub', district: 'Namakkal', deliveryArea: namakkalArea._id, deliveryAreaName: namakkalArea.name, estimatedDeliveryDays: 1, isActive: true },

      // Salem
      { pincode: '636001', areaName: 'Salem Town / Cherry Road', district: 'Salem', deliveryArea: salemArea._id, deliveryAreaName: salemArea.name, estimatedDeliveryDays: 1, isActive: true },
      { pincode: '636004', areaName: 'Meyyanur / Fairlands Medical Hub', district: 'Salem', deliveryArea: salemArea._id, deliveryAreaName: salemArea.name, estimatedDeliveryDays: 1, isActive: true },
      { pincode: '636007', areaName: 'Ammapet Commercial Sector', district: 'Salem', deliveryArea: salemArea._id, deliveryAreaName: salemArea.name, estimatedDeliveryDays: 1, isActive: true },
      { pincode: '636030', areaName: 'Salem Steel Plant Hospital Road', district: 'Salem', deliveryArea: salemArea._id, deliveryAreaName: salemArea.name, estimatedDeliveryDays: 2, isActive: true },
    ];

    await Pincode.insertMany(pincodesList);

    // 3. Create Categories
    const categoriesData = [
      { name: 'Antibiotics & Anti-Infectives', slug: 'antibiotics', description: 'Broad-spectrum oral and injectable antimicrobials and cephalosporins', icon: 'ShieldAlert', displayOrder: 1 },
      { name: 'Cardiovascular & Anti-Hypertensives', slug: 'cardiovascular', description: 'ACE inhibitors, ARBs, Beta blockers, and Statins for chronic cardiac care', icon: 'HeartPulse', displayOrder: 2 },
      { name: 'Anti-Diabetic & Endocrinology', slug: 'anti-diabetic', description: 'Oral hypoglycemics, DPP-4 inhibitors, SGLT-2, and insulin maintenance', icon: 'Activity', displayOrder: 3 },
      { name: 'Analgesics, NSAIDs & Pain Relief', slug: 'pain-relief', description: 'Antipyretics, muscle relaxants, and anti-inflammatory formulations', icon: 'Zap', displayOrder: 4 },
      { name: 'Gastrointestinal & Antacids', slug: 'gastrointestinal', description: 'PPIs, H2 blockers, prokinetics, antispasmodics, and laxatives', icon: 'Shield', displayOrder: 5 },
      { name: 'Respiratory & Anti-Allergics', slug: 'respiratory', description: 'Bronchodilators, antihistamines, cough syrups, and inhaler mDI solutions', icon: 'Wind', displayOrder: 6 },
      { name: 'Dermatology & Topical Formulations', slug: 'dermatology', description: 'Antifungal creams, corticosteroid ointments, and medical emollients', icon: 'Sparkles', displayOrder: 7 },
      { name: 'Vitamins, Minerals & Supplements', slug: 'vitamins', description: 'Nutraceuticals, multivitamin infusions, and zinc-calcium complexes', icon: 'Pill', displayOrder: 8 },
      { name: 'Critical Care & IV Infusions', slug: 'critical-care', description: 'Dextrose, Normal Saline, Ringer Lactate, and emergency ampoules', icon: 'Droplets', displayOrder: 9 },
      { name: 'Pediatric Formulations & Syrups', slug: 'pediatric', description: 'Child-friendly suspension drops, oral electrolytes, and flavored tonics', icon: 'Baby', displayOrder: 10 },
    ];

    const savedCategories = await Category.insertMany(categoriesData);
    const catMap = {};
    savedCategories.forEach((c) => {
      catMap[c.slug] = c._id;
    });

    // 4. Create Medicines Catalog
    const medicinesData = [
      // Antibiotics
      {
        name: 'Augmentin 625 Duo Tablet',
        genericName: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
        manufacturer: 'GlaxoSmithKline (GSK)',
        category: catMap['antibiotics'],
        dosageForm: 'Tablet',
        packSize: '10x10 Strip Box (100 Tabs)',
        wholesalePrice: 168.50,
        mrp: 223.40,
        gstRate: 12,
        stock: 350,
        lowStockThreshold: 30,
        batchNumber: 'AUG-2026-X81',
        expiryDate: new Date('2028-06-30'),
        manufacturingDate: new Date('2026-01-15'),
        hsnCode: '3004',
        description: 'Potent bactericidal beta-lactamase inhibitor combination for upper & lower respiratory tract, ENT, and soft tissue infections.',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Azithral 500mg Tablet',
        genericName: 'Azithromycin (500mg)',
        manufacturer: 'Alembic Pharmaceuticals',
        category: catMap['antibiotics'],
        dosageForm: 'Tablet',
        packSize: '10x3 Tablets Box',
        wholesalePrice: 94.20,
        mrp: 132.00,
        gstRate: 12,
        stock: 520,
        lowStockThreshold: 40,
        batchNumber: 'AZT-9923-M1',
        expiryDate: new Date('2027-12-31'),
        manufacturingDate: new Date('2025-11-10'),
        hsnCode: '3004',
        description: 'Macrolide antibiotic active against susceptible gram-positive and atypical organisms with convenient once-daily dosage.',
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80',
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Cefix 200mg DT Tablet',
        genericName: 'Cefixime Trihydrate (200mg)',
        manufacturer: 'Cipla Ltd',
        category: catMap['antibiotics'],
        dosageForm: 'Tablet',
        packSize: '10x10 Strip Box',
        wholesalePrice: 88.00,
        mrp: 118.50,
        gstRate: 12,
        stock: 280,
        lowStockThreshold: 25,
        batchNumber: 'CFX-4410-C3',
        expiryDate: new Date('2028-03-31'),
        manufacturingDate: new Date('2026-02-01'),
        hsnCode: '3004',
        description: 'Third-generation cephalosporin for acute bronchitis, typhoid fever, and uncomplicated urinary tract infections.',
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80',
        isActive: true,
        isFeatured: false,
      },

      // Cardiovascular
      {
        name: 'Telma-H 40/12.5 Tablet',
        genericName: 'Telmisartan (40mg) + Hydrochlorothiazide (12.5mg)',
        manufacturer: 'Glenmark Pharmaceuticals',
        category: catMap['cardiovascular'],
        dosageForm: 'Tablet',
        packSize: '10x15 Tablets (150 Tabs)',
        wholesalePrice: 174.00,
        mrp: 248.00,
        gstRate: 12,
        stock: 410,
        lowStockThreshold: 35,
        batchNumber: 'TLM-2026-G8',
        expiryDate: new Date('2028-09-30'),
        manufacturingDate: new Date('2026-01-20'),
        hsnCode: '3004',
        description: 'First-line dual combination antihypertensive therapy providing steady 24-hour blood pressure control.',
        image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&auto=format&fit=crop&q=80',
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Rosuvas 10mg Tablet',
        genericName: 'Rosuvastatin Calcium (10mg)',
        manufacturer: 'Sun Pharmaceutical Industries',
        category: catMap['cardiovascular'],
        dosageForm: 'Tablet',
        packSize: '10x10 Alu-Alu Pack',
        wholesalePrice: 142.50,
        mrp: 198.00,
        gstRate: 12,
        stock: 390,
        lowStockThreshold: 30,
        batchNumber: 'RSV-8821-S2',
        expiryDate: new Date('2028-08-31'),
        manufacturingDate: new Date('2025-10-15'),
        hsnCode: '3004',
        description: 'High-intensity HMG-CoA reductase inhibitor for dyslipidemia and cardiovascular event risk reduction.',
        image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80',
        isActive: true,
        isFeatured: false,
      },
      {
        name: 'Amlong 5mg Tablet',
        genericName: 'Amlodipine Besylate (5mg)',
        manufacturer: 'Micro Labs Ltd',
        category: catMap['cardiovascular'],
        dosageForm: 'Tablet',
        packSize: '10x15 Blister Pack',
        wholesalePrice: 42.00,
        mrp: 62.50,
        gstRate: 12,
        stock: 650,
        lowStockThreshold: 50,
        batchNumber: 'AML-1029-M4',
        expiryDate: new Date('2028-11-30'),
        manufacturingDate: new Date('2026-02-10'),
        hsnCode: '3004',
        description: 'Long-acting dihydropyridine calcium channel blocker for chronic essential hypertension and angina pectoris.',
        image: 'https://images.unsplash.com/photo-1576073719676-aa95576db207?w=600&auto=format&fit=crop&q=80',
        isActive: true,
        isFeatured: false,
      },

      // Anti-Diabetic
      {
        name: 'Glycomet-GP 2 Forte Tablet',
        genericName: 'Metformin SR (1000mg) + Glimepiride (2mg)',
        manufacturer: 'USV Private Limited',
        category: catMap['anti-diabetic'],
        dosageForm: 'Tablet',
        packSize: '10x15 Tablets Strip',
        wholesalePrice: 162.00,
        mrp: 232.50,
        gstRate: 12,
        stock: 480,
        lowStockThreshold: 40,
        batchNumber: 'GLY-7731-U9',
        expiryDate: new Date('2028-05-31'),
        manufacturingDate: new Date('2026-01-05'),
        hsnCode: '3004',
        description: 'Dual action sustained release oral anti-diabetic formulation for comprehensive glycemic control in Type-2 Diabetes.',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Jalra-M 50/500mg Tablet',
        genericName: 'Vildagliptin (50mg) + Metformin (500mg)',
        manufacturer: 'Novartis Healthcare',
        category: catMap['anti-diabetic'],
        dosageForm: 'Tablet',
        packSize: '10x10 Strip Box',
        wholesalePrice: 245.00,
        mrp: 320.00,
        gstRate: 12,
        stock: 190,
        lowStockThreshold: 20,
        batchNumber: 'JLR-3320-N1',
        expiryDate: new Date('2027-10-31'),
        manufacturingDate: new Date('2025-09-12'),
        hsnCode: '3004',
        description: 'DPP-4 inhibitor combined with biguanide for physiological glucose-dependent insulin secretion without hypoglycemia.',
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80',
        isActive: true,
        isFeatured: false,
      },

      // Pain Relief & Analgesics
      {
        name: 'Dolo 650mg Tablet',
        genericName: 'Paracetamol (650mg)',
        manufacturer: 'Micro Labs Ltd',
        category: catMap['pain-relief'],
        dosageForm: 'Tablet',
        packSize: '10x15 Tablets (150 Tabs)',
        wholesalePrice: 28.50,
        mrp: 37.80,
        gstRate: 12,
        stock: 1200,
        lowStockThreshold: 100,
        batchNumber: 'DOL-9901-M8',
        expiryDate: new Date('2029-01-31'),
        manufacturingDate: new Date('2026-02-01'),
        hsnCode: '3004',
        description: 'Standard household & clinical antipyretic-analgesic for pyrexia, body ache, viral fever, and headache.',
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80',
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Zerodol-SP Tablet',
        genericName: 'Aceclofenac (100mg) + Paracetamol (325mg) + Serratiopeptidase (15mg)',
        manufacturer: 'Ipca Laboratories',
        category: catMap['pain-relief'],
        dosageForm: 'Tablet',
        packSize: '10x10 Strip Box',
        wholesalePrice: 86.40,
        mrp: 124.00,
        gstRate: 12,
        stock: 540,
        lowStockThreshold: 50,
        batchNumber: 'ZRD-5512-I4',
        expiryDate: new Date('2028-07-31'),
        manufacturingDate: new Date('2026-01-18'),
        hsnCode: '3004',
        description: 'Triple active therapeutic formulation providing rapid anti-inflammatory, analgesic, and edema reduction relief.',
        image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&auto=format&fit=crop&q=80',
        isActive: true,
        isFeatured: true,
      },

      // Gastrointestinal
      {
        name: 'Pan-D Capsule',
        genericName: 'Pantoprazole (40mg) + Domperidone (30mg SR)',
        manufacturer: 'Alkem Laboratories',
        category: catMap['gastrointestinal'],
        dosageForm: 'Capsule',
        packSize: '10x15 Capsule Box (150 Caps)',
        wholesalePrice: 158.00,
        mrp: 228.00,
        gstRate: 12,
        stock: 460,
        lowStockThreshold: 40,
        batchNumber: 'PAN-3390-A7',
        expiryDate: new Date('2028-06-30'),
        manufacturingDate: new Date('2025-12-10'),
        hsnCode: '3004',
        description: 'Proton pump inhibitor with prokinetic agent for GERD, hyperacidity, peptic ulcer, and reflux gastritis.',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Omee 20mg Capsule',
        genericName: 'Omeprazole (20mg)',
        manufacturer: 'Alkem Laboratories',
        category: catMap['gastrointestinal'],
        dosageForm: 'Capsule',
        packSize: '10x20 Strip Box',
        wholesalePrice: 48.00,
        mrp: 68.00,
        gstRate: 12,
        stock: 310,
        lowStockThreshold: 30,
        batchNumber: 'OME-1022-A1',
        expiryDate: new Date('2028-04-30'),
        manufacturingDate: new Date('2025-11-20'),
        hsnCode: '3004',
        description: 'Enteric coated omeprazole capsules for prompt acid suppression and gastric mucosa protection.',
        image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80',
        isActive: true,
        isFeatured: false,
      },

      // Respiratory
      {
        name: 'Montair-LC Tablet',
        genericName: 'Montelukast (10mg) + Levocetirizine (5mg)',
        manufacturer: 'Cipla Ltd',
        category: catMap['respiratory'],
        dosageForm: 'Tablet',
        packSize: '10x10 Strip Box',
        wholesalePrice: 148.00,
        mrp: 215.00,
        gstRate: 12,
        stock: 370,
        lowStockThreshold: 30,
        batchNumber: 'MNT-8812-C9',
        expiryDate: new Date('2028-05-31'),
        manufacturingDate: new Date('2026-01-22'),
        hsnCode: '3004',
        description: 'Dual anti-leukotriene and H1 antihistaminic combination for seasonal allergic rhinitis and chronic bronchial asthma.',
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80',
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Ascoril-LS Syrup (100ml)',
        genericName: 'Levosalbutamol (1mg) + Ambroxol (30mg) + Guaiphenesin (50mg)',
        manufacturer: 'Glenmark Pharmaceuticals',
        category: catMap['respiratory'],
        dosageForm: 'Syrup',
        packSize: '100ml PET Bottle',
        wholesalePrice: 78.50,
        mrp: 114.00,
        gstRate: 12,
        stock: 420,
        lowStockThreshold: 35,
        batchNumber: 'ASC-6610-G2',
        expiryDate: new Date('2027-11-30'),
        manufacturingDate: new Date('2025-10-25'),
        hsnCode: '3004',
        description: 'Mucolytic, bronchodilator, and expectorant syrup for productive cough associated with bronchospasm.',
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80',
        isActive: true,
        isFeatured: false,
      },

      // Vitamins & Nutrition
      {
        name: 'Becadexamin Softgel Capsule',
        genericName: 'Multivitamins + Multiminerals + Trace Elements',
        manufacturer: 'GlaxoSmithKline (GSK)',
        category: catMap['vitamins'],
        dosageForm: 'Capsule',
        packSize: '1x30 Softgels Bottle',
        wholesalePrice: 46.50,
        mrp: 64.20,
        gstRate: 12,
        stock: 620,
        lowStockThreshold: 50,
        batchNumber: 'BCD-2291-G5',
        expiryDate: new Date('2028-03-31'),
        manufacturingDate: new Date('2025-12-15'),
        hsnCode: '3004',
        description: 'Essential therapeutic nutritional daily supplement supporting immune health, tissue repair, and vitality.',
        image: 'https://images.unsplash.com/photo-1576073719676-aa95576db207?w=600&auto=format&fit=crop&q=80',
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Shelcal 500mg Tablet',
        genericName: 'Calcium Carbonate (1250mg eq to 500mg Elemental Ca) + Vitamin D3 (250 IU)',
        manufacturer: 'Torrent Pharmaceuticals',
        category: catMap['vitamins'],
        dosageForm: 'Tablet',
        packSize: '1x15 Tablets Strip (15 Tabs)',
        wholesalePrice: 88.00,
        mrp: 127.50,
        gstRate: 12,
        stock: 580,
        lowStockThreshold: 45,
        batchNumber: 'SHC-4421-T3',
        expiryDate: new Date('2028-08-31'),
        manufacturingDate: new Date('2026-02-05'),
        hsnCode: '3004',
        description: 'Superior bioavailability calcium formulation for bone mineral density, pregnancy, and post-menopausal support.',
        image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&auto=format&fit=crop&q=80',
        isActive: true,
        isFeatured: true,
      },

      // IV Fluids & Critical Care
      {
        name: 'Normal Saline 0.9% IV Infusion (500ml)',
        genericName: 'Sodium Chloride (0.9% w/v IV Infusion)',
        manufacturer: 'Claris / Baxter India',
        category: catMap['critical-care'],
        dosageForm: 'IV Infusion',
        packSize: 'Box of 24 FFS Bottles (500ml each)',
        wholesalePrice: 384.00,
        mrp: 528.00,
        gstRate: 12,
        stock: 180,
        lowStockThreshold: 20,
        batchNumber: 'NS-500-B21',
        expiryDate: new Date('2028-12-31'),
        manufacturingDate: new Date('2026-01-10'),
        hsnCode: '3004',
        description: 'Isotonic sterile fluid for extracellular volume restoration, electrolyte replacement, and emergency resuscitation.',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
        isActive: true,
        isFeatured: false,
      },
      {
        name: 'Ringer Lactate (RL) 500ml Infusion',
        genericName: 'Compound Sodium Lactate Injection IP',
        manufacturer: 'Otsuka Pharmaceutical India',
        category: catMap['critical-care'],
        dosageForm: 'IV Infusion',
        packSize: 'Box of 24 Bottles (500ml)',
        wholesalePrice: 420.00,
        mrp: 576.00,
        gstRate: 12,
        stock: 15, // Low stock for alert testing
        lowStockThreshold: 25,
        batchNumber: 'RL-500-O88',
        expiryDate: new Date('2028-10-31'),
        manufacturingDate: new Date('2025-11-01'),
        hsnCode: '3004',
        description: 'Physiological balanced crystalloid solution for surgical fluid therapy, severe dehydration, and metabolic acidosis.',
        image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80',
        isActive: true,
        isFeatured: false,
      },
    ];

    const savedMedicines = await Medicine.insertMany(medicinesData);

    // 5. Create System Users (Admin, Staff, Approved Client, Pending Client, Rejected Client)
    // Salt & Hash demo passwords
    const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
    const staffPasswordHash = await bcrypt.hash('Staff@123', 10);
    const clientPasswordHash = await bcrypt.hash('Client@123', 10);
    const pendingPasswordHash = await bcrypt.hash('Pending@123', 10);
    const rejectedPasswordHash = await bcrypt.hash('Rejected@123', 10);

    // Admin User
    const adminUser = await User.create({
      name: 'R. Sakthivel (Executive Director)',
      email: 'admin@sakthimurugan.com',
      phone: '9994446994',
      passwordHash: adminPasswordHash,
      role: 'admin',
      accountStatus: 'approved',
      businessDetails: {
        shopName: 'SAKTHIMURUGAN MEDICAL AGENCY (HQ)',
        businessType: 'Wholesale Distributor',
        drugLicenseNumber: 'TN/ERD/20B/10492 & 21B/10493',
        gstin: '33AABCS1234F1Z8',
        ownerName: 'R. Sakthivel',
      },
      addresses: [
        {
          addressLine: '50, 1st Floor, Kamaraj Street',
          landmark: 'Near Old Bus Stand',
          city: 'Erode',
          district: 'Erode',
          state: 'Tamil Nadu',
          pincode: '638001',
          isDefault: true,
        },
      ],
      themePreference: 'light',
    });

    // Staff User
    const staffUser = await User.create({
      name: 'M. Senthil Kumar (Operations Incharge)',
      email: 'staff@sakthimurugan.com',
      phone: '9865730150',
      passwordHash: staffPasswordHash,
      role: 'staff',
      accountStatus: 'approved',
      businessDetails: {
        shopName: 'Sakthimurugan Logistics & Dispatch Unit',
        businessType: 'Wholesale Distributor',
      },
      addresses: [
        {
          addressLine: 'Warehouse Block B, Kamaraj Street',
          city: 'Erode',
          district: 'Erode',
          state: 'Tamil Nadu',
          pincode: '638001',
          isDefault: true,
        },
      ],
      themePreference: 'light',
    });

    // Approved Client (Murugan Pharmacy)
    const approvedClient = await User.create({
      name: 'Dr. K. Arumugam (Chief Pharmacist)',
      email: 'client@muruganpharmacy.com',
      phone: '9443210987',
      passwordHash: clientPasswordHash,
      role: 'client',
      accountStatus: 'approved',
      approvedAt: new Date('2026-01-10'),
      approvedBy: adminUser._id,
      businessDetails: {
        shopName: 'Murugan Super Speciality Pharmacy',
        businessType: 'Pharmacy / Medical Shop',
        drugLicenseNumber: 'TN/ERD/20B/88219 & 21B/88220',
        gstin: '33AAACM5542G1ZP',
        ownerName: 'Dr. K. Arumugam',
        panNumber: 'AAACM5542G',
      },
      addresses: [
        {
          addressLine: '142, Perundurai Main Road, Opp Government Hospital',
          landmark: 'Opposite GH Gate 2',
          city: 'Erode',
          district: 'Erode',
          state: 'Tamil Nadu',
          pincode: '638009',
          isDefault: true,
        },
      ],
      themePreference: 'light',
    });

    // Pending Client (Kaveri Medicals)
    const pendingClient = await User.create({
      name: 'V. Rajesh Kumar',
      email: 'pending@kaverimedicals.com',
      phone: '9842109876',
      passwordHash: pendingPasswordHash,
      role: 'client',
      accountStatus: 'pending',
      businessDetails: {
        shopName: 'Kaveri Medicals & General Store',
        businessType: 'Pharmacy / Medical Shop',
        drugLicenseNumber: 'TN/KRR/20B/99014',
        gstin: '33AABCK8890K1ZW',
        ownerName: 'V. Rajesh Kumar',
      },
      addresses: [
        {
          addressLine: '28, Jawahar Bazaar Main Road',
          city: 'Karur',
          district: 'Karur',
          state: 'Tamil Nadu',
          pincode: '639001',
          isDefault: true,
        },
      ],
      themePreference: 'light',
    });

    // Rejected Client (Apex Dispensary)
    const rejectedClient = await User.create({
      name: 'S. Manohar',
      email: 'rejected@apexclinic.com',
      phone: '9789012345',
      passwordHash: rejectedPasswordHash,
      role: 'client',
      accountStatus: 'rejected',
      rejectionReason: 'Invalid / expired Form 20B wholesale drug license copy attached. Re-application required.',
      businessDetails: {
        shopName: 'Apex Health Dispensary',
        businessType: 'Hospital / Clinic',
        drugLicenseNumber: 'TN/SLM/20B/EXPIRED',
        gstin: '',
        ownerName: 'S. Manohar',
      },
      addresses: [
        {
          addressLine: '77, Fairlands 4th Cross',
          city: 'Salem',
          district: 'Salem',
          state: 'Tamil Nadu',
          pincode: '636004',
          isDefault: true,
        },
      ],
      themePreference: 'light',
    });

    // 6. Create Business Applications
    await BusinessApplication.create([
      {
        applicant: approvedClient._id,
        applicantName: approvedClient.name,
        businessName: approvedClient.businessDetails.shopName,
        businessType: approvedClient.businessDetails.businessType,
        phone: approvedClient.phone,
        email: approvedClient.email,
        address: approvedClient.addresses[0].addressLine,
        city: approvedClient.addresses[0].city,
        district: approvedClient.addresses[0].district,
        state: 'Tamil Nadu',
        pincode: approvedClient.addresses[0].pincode,
        drugLicenseNumber: approvedClient.businessDetails.drugLicenseNumber,
        gstin: approvedClient.businessDetails.gstin,
        status: 'approved',
        reviewedBy: adminUser._id,
        reviewedAt: new Date('2026-01-10'),
        adminNotes: 'Drug license verified with Tamil Nadu Drug Control Administration portal.',
      },
      {
        applicant: pendingClient._id,
        applicantName: pendingClient.name,
        businessName: pendingClient.businessDetails.shopName,
        businessType: pendingClient.businessDetails.businessType,
        phone: pendingClient.phone,
        email: pendingClient.email,
        address: pendingClient.addresses[0].addressLine,
        city: pendingClient.addresses[0].city,
        district: pendingClient.addresses[0].district,
        state: 'Tamil Nadu',
        pincode: pendingClient.addresses[0].pincode,
        drugLicenseNumber: pendingClient.businessDetails.drugLicenseNumber,
        gstin: pendingClient.businessDetails.gstin,
        status: 'pending',
      },
      {
        applicant: rejectedClient._id,
        applicantName: rejectedClient.name,
        businessName: rejectedClient.businessDetails.shopName,
        businessType: rejectedClient.businessDetails.businessType,
        phone: rejectedClient.phone,
        email: rejectedClient.email,
        address: rejectedClient.addresses[0].addressLine,
        city: rejectedClient.addresses[0].city,
        district: rejectedClient.addresses[0].district,
        state: 'Tamil Nadu',
        pincode: rejectedClient.addresses[0].pincode,
        drugLicenseNumber: rejectedClient.businessDetails.drugLicenseNumber,
        gstin: rejectedClient.businessDetails.gstin,
        status: 'rejected',
        reviewedBy: adminUser._id,
        reviewedAt: new Date('2026-02-15'),
        rejectionReason: 'Invalid / expired Form 20B wholesale drug license copy attached. Re-application required.',
      },
    ]);

    // 7. Create Sample Completed & Processing Orders for Murugan Pharmacy
    const med1 = savedMedicines[0]; // Augmentin 625
    const med2 = savedMedicines[3]; // Telma-H 40
    const med3 = savedMedicines[8]; // Dolo 650

    const orderItems1 = [
      {
        medicine: med1._id,
        name: med1.name,
        genericName: med1.genericName,
        manufacturer: med1.manufacturer,
        batchNumber: med1.batchNumber,
        packSize: med1.packSize,
        quantity: 5,
        unitPrice: med1.wholesalePrice,
        mrp: med1.mrp,
        gstRate: 12,
        subtotal: +(5 * med1.wholesalePrice).toFixed(2),
        gstAmount: +(5 * med1.wholesalePrice * 0.12).toFixed(2),
        total: +(5 * med1.wholesalePrice * 1.12).toFixed(2),
      },
      {
        medicine: med3._id,
        name: med3.name,
        genericName: med3.genericName,
        manufacturer: med3.manufacturer,
        batchNumber: med3.batchNumber,
        packSize: med3.packSize,
        quantity: 10,
        unitPrice: med3.wholesalePrice,
        mrp: med3.mrp,
        gstRate: 12,
        subtotal: +(10 * med3.wholesalePrice).toFixed(2),
        gstAmount: +(10 * med3.wholesalePrice * 0.12).toFixed(2),
        total: +(10 * med3.wholesalePrice * 1.12).toFixed(2),
      },
    ];

    const subtotal1 = +(orderItems1[0].subtotal + orderItems1[1].subtotal).toFixed(2);
    const gstTotal1 = +(orderItems1[0].gstAmount + orderItems1[1].gstAmount).toFixed(2);
    const grandTotal1 = +(subtotal1 + gstTotal1).toFixed(2);

    const sampleOrder1 = await Order.create({
      orderId: 'SMA-2026-0220-4102',
      user: approvedClient._id,
      businessName: approvedClient.businessDetails.shopName,
      drugLicenseNumber: approvedClient.businessDetails.drugLicenseNumber,
      gstin: approvedClient.businessDetails.gstin,
      items: orderItems1,
      subtotal: subtotal1,
      cgst: +(gstTotal1 / 2).toFixed(2),
      sgst: +(gstTotal1 / 2).toFixed(2),
      igst: 0,
      gstTotal: gstTotal1,
      grandTotal: grandTotal1,
      deliveryAddress: approvedClient.addresses[0],
      deliveryArea: erodeArea._id,
      deliveryAreaName: erodeArea.name,
      status: 'Delivered',
      statusHistory: [
        { status: 'Pending', timestamp: new Date('2026-02-20T09:00:00Z'), note: 'Order placed by client', updatedBy: approvedClient._id },
        { status: 'Confirmed', timestamp: new Date('2026-02-20T09:30:00Z'), note: 'Stock allocated in warehouse', updatedBy: staffUser._id },
        { status: 'Processing', timestamp: new Date('2026-02-20T10:15:00Z'), note: 'Packed with temperature monitor', updatedBy: staffUser._id },
        { status: 'Dispatched', timestamp: new Date('2026-02-20T11:45:00Z'), note: 'Van TN-33-AX-8921 out for delivery', updatedBy: staffUser._id },
        { status: 'Delivered', timestamp: new Date('2026-02-20T14:20:00Z'), note: 'Delivered & signed by Dr. K. Arumugam', updatedBy: staffUser._id },
      ],
      paymentMethod: 'Direct B2B Bank Transfer (NEFT/RTGS)',
      paymentStatus: 'Paid',
      invoiceNumber: 'INV-SMA-26-10491',
      deliveryAssignment: {
        staffMember: staffUser._id,
        staffName: staffUser.name,
        staffPhone: staffUser.phone,
        vehicleNumber: 'TN-33-AX-8921 (Agency Delivery Van)',
        dispatchDate: new Date('2026-02-20T11:45:00Z'),
        expectedDeliveryDate: new Date('2026-02-20T15:00:00Z'),
        deliveryNotes: 'Perundurai Road Circuit Dispatch',
      },
    });

    // Create Invoice for sample order 1
    await Invoice.create({
      invoiceNumber: 'INV-SMA-26-10491',
      order: sampleOrder1._id,
      orderId: sampleOrder1.orderId,
      user: approvedClient._id,
      sellerDetails: {
        companyName: 'SAKTHIMURUGAN MEDICAL AGENCY',
        address: '50, 1st Floor, Kamaraj Street, Erode, Tamil Nadu - 638001',
        phone: '9994446994, 9865730150',
        email: 'orders@sakthimuruganmedicals.com',
        drugLicenseNumber: 'TN/ERD/20B/10492 & 21B/10493',
        gstin: '33AABCS1234F1Z8',
      },
      buyerDetails: {
        shopName: approvedClient.businessDetails.shopName,
        contactPerson: approvedClient.name,
        phone: approvedClient.phone,
        email: approvedClient.email,
        addressLine: approvedClient.addresses[0].addressLine,
        city: approvedClient.addresses[0].city,
        district: approvedClient.addresses[0].district,
        state: 'Tamil Nadu',
        pincode: approvedClient.addresses[0].pincode,
        drugLicenseNumber: approvedClient.businessDetails.drugLicenseNumber,
        gstin: approvedClient.businessDetails.gstin,
      },
      items: orderItems1,
      subtotal: subtotal1,
      cgst: +(gstTotal1 / 2).toFixed(2),
      sgst: +(gstTotal1 / 2).toFixed(2),
      igst: 0,
      gstTotal: gstTotal1,
      grandTotal: grandTotal1,
      paymentStatus: 'Paid',
      paymentMethod: 'Direct B2B Bank Transfer (NEFT/RTGS)',
      issuedDate: new Date('2026-02-20T09:30:00Z'),
    });

    // Sample Active Order 2 (In Dispatched status)
    const orderItems2 = [
      {
        medicine: med2._id,
        name: med2.name,
        genericName: med2.genericName,
        manufacturer: med2.manufacturer,
        batchNumber: med2.batchNumber,
        packSize: med2.packSize,
        quantity: 8,
        unitPrice: med2.wholesalePrice,
        mrp: med2.mrp,
        gstRate: 12,
        subtotal: +(8 * med2.wholesalePrice).toFixed(2),
        gstAmount: +(8 * med2.wholesalePrice * 0.12).toFixed(2),
        total: +(8 * med2.wholesalePrice * 1.12).toFixed(2),
      },
    ];
    const subtotal2 = orderItems2[0].subtotal;
    const gstTotal2 = orderItems2[0].gstAmount;
    const grandTotal2 = +(subtotal2 + gstTotal2).toFixed(2);

    const sampleOrder2 = await Order.create({
      orderId: 'SMA-2026-0928-8819',
      user: approvedClient._id,
      businessName: approvedClient.businessDetails.shopName,
      drugLicenseNumber: approvedClient.businessDetails.drugLicenseNumber,
      gstin: approvedClient.businessDetails.gstin,
      items: orderItems2,
      subtotal: subtotal2,
      cgst: +(gstTotal2 / 2).toFixed(2),
      sgst: +(gstTotal2 / 2).toFixed(2),
      igst: 0,
      gstTotal: gstTotal2,
      grandTotal: grandTotal2,
      deliveryAddress: approvedClient.addresses[0],
      deliveryArea: erodeArea._id,
      deliveryAreaName: erodeArea.name,
      status: 'Dispatched',
      statusHistory: [
        { status: 'Pending', timestamp: new Date(Date.now() - 3600000 * 3), note: 'Order placed by client', updatedBy: approvedClient._id },
        { status: 'Confirmed', timestamp: new Date(Date.now() - 3600000 * 2), note: 'Stock verified in warehouse rack', updatedBy: staffUser._id },
        { status: 'Processing', timestamp: new Date(Date.now() - 3600000 * 1), note: 'Packing completed & sealed', updatedBy: staffUser._id },
        { status: 'Dispatched', timestamp: new Date(), note: 'Out for delivery via Agency Van TN-33-AX-8921', updatedBy: staffUser._id },
      ],
      paymentMethod: '30-Day Credit (Wholesale Approved)',
      paymentStatus: 'Credit Approved',
      invoiceNumber: 'INV-SMA-26-88192',
      deliveryAssignment: {
        staffMember: staffUser._id,
        staffName: staffUser.name,
        staffPhone: staffUser.phone,
        vehicleNumber: 'TN-33-AX-8921 (Agency Delivery Van)',
        dispatchDate: new Date(),
        expectedDeliveryDate: new Date(Date.now() + 3600000 * 4),
        deliveryNotes: 'Urgent cardiac replenishment shipment',
      },
    });

    await Invoice.create({
      invoiceNumber: 'INV-SMA-26-88192',
      order: sampleOrder2._id,
      orderId: sampleOrder2.orderId,
      user: approvedClient._id,
      sellerDetails: {
        companyName: 'SAKTHIMURUGAN MEDICAL AGENCY',
        address: '50, 1st Floor, Kamaraj Street, Erode, Tamil Nadu - 638001',
        phone: '9994446994, 9865730150',
        email: 'orders@sakthimuruganmedicals.com',
        drugLicenseNumber: 'TN/ERD/20B/10492 & 21B/10493',
        gstin: '33AABCS1234F1Z8',
      },
      buyerDetails: {
        shopName: approvedClient.businessDetails.shopName,
        contactPerson: approvedClient.name,
        phone: approvedClient.phone,
        email: approvedClient.email,
        addressLine: approvedClient.addresses[0].addressLine,
        city: approvedClient.addresses[0].city,
        district: approvedClient.addresses[0].district,
        state: 'Tamil Nadu',
        pincode: approvedClient.addresses[0].pincode,
        drugLicenseNumber: approvedClient.businessDetails.drugLicenseNumber,
        gstin: approvedClient.businessDetails.gstin,
      },
      items: orderItems2,
      subtotal: subtotal2,
      cgst: +(gstTotal2 / 2).toFixed(2),
      sgst: +(gstTotal2 / 2).toFixed(2),
      igst: 0,
      gstTotal: gstTotal2,
      grandTotal: grandTotal2,
      paymentStatus: 'Credit Approved',
      paymentMethod: '30-Day Credit (Wholesale Approved)',
      issuedDate: new Date(),
    });

    console.log('Wholesale database seeded successfully!');
    console.log('Demo Accounts ready:');
    console.log('  Admin:   admin@sakthimurugan.com   | Pass: Admin@123');
    console.log('  Staff:   staff@sakthimurugan.com   | Pass: Staff@123');
    console.log('  Client:  client@muruganpharmacy.com | Pass: Client@123 (Approved)');
    console.log('  Pending: pending@kaverimedicals.com | Pass: Pending@123 (Pending)');
    console.log('  Reject:  rejected@apexclinic.com    | Pass: Rejected@123 (Rejected)');
  } catch (error) {
    console.error('Seeding error:', error);
  }
};

module.exports = seedAllData;
