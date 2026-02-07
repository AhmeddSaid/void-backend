const mongoose = require("mongoose");
const Product = require("./models/productModel");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const updates = [
  {
    slug: "void-heavyweight-hoodie-black",
    data: {
      nameAr: "هودي فويد ثقيل - أسود",
      description: "Elevate your everyday rotation with the VOID Heavyweight Hoodie. Expertly crafted from 100% premium cotton, this piece offers substantial weight and structure without the use of synthetic blends. The fabric features a high-density 'Sponge' knit construction with a luxuriously soft, brushed interior for natural warmth. Designed with a boxy, oversized silhouette, it provides a clean, premium drape that only pure cotton can achieve.",
      descriptionAr: "مصنوع من صوف ناعم وثقيل الوزن عالي الجودة (350-500 جم)، تم تصميم هذا الهودي ليوفر أقصى درجات الدفء والمتانة. تمنحك تقنية نسيج 'الإسفنج' ملمساً كثيفاً ومنتفخاً يحافظ على شكله، مع بطانة داخلية ناعمة جداً لراحة قصوى. بوزن يصل إلى 1 كجم، إنه قطعة شتوية أساسية صممت لتدوم.",
      
      // SEO English
      metaTitle: "VOID Heavyweight Hoodie - Black | Premium Streetwear",
      metaDescription: "Shop the VOID Heavyweight Hoodie in Black. 1KG premium brushed cotton fleece for ultimate warmth and structure.",
      
      // SEO Arabic
      metaTitleAr: "هودي فويد أسود ثقيل | خامة بريميوم",
      metaDescriptionAr: "تسوق هودي فويد الأسود المصنوع من القطن الثقيل عالي الجودة. دفء وراحة وأناقة.",
      
      keywords: "hoodie, black, void, streetwear, heavyweight, cotton, هودي, أسود, فويد, ملابس شتوية",
      
      // Detailed Info
      specifications: {
        composition: "100% Cotton",
        compositionAr: "١٠٠٪ قطن",
        fabricType: "Heavyweight Brushed Fleece (Sponge Milton)",
        fabricTypeAr: "ميلتون مبطن ثقيل (سفنج)",
        weightGsm: "350–500 GSM",
        fitType: "Relaxed / Oversized / Boxy",
        fitTypeAr: "مريح / واسع / بوكسي",
        features: [
            "No synthetic blends (100% Natural Fibers)",
            "Soft-brushed interior for high warmth",
            "High-density fabric structure",
            "Dropped shoulders for a streetwear look",
            "Robust ribbed cuffs and hem",
            "Resistant to pilling"
        ],
        featuresAr: [
            "بدون ألياف صناعية (١٠٠٪ ألياف طبيعية)",
            "بطانة ناعمة لتدفئة عالية",
            "نسيج عالي الكثافة",
            "أكتاف منسدلة لمظهر عصري",
            "أساور وحواف متينة",
            "مقاوم للوبر"
        ]
      },
      sizeChart: {
        unit: "cm",
        notes: "Measurements are taken flat. Allow for 1-2cm tolerance.",
        notesAr: "المقاسات مأخوذة والقطعة مسطحة. قد تختلف ١-٢ سم.",
        sizes: [
            { size: "S", chestWidth: 58, bodyLength: 68 },
            { size: "M", chestWidth: 60, bodyLength: 69 },
            { size: "L", chestWidth: 62, bodyLength: 73 },
            { size: "XL", chestWidth: 64, bodyLength: 76 },
            { size: "XXL", chestWidth: 66, bodyLength: 79 }
        ]
      },
      careInstructions: [
        "Machine wash cold (30°C max)",
        "Wash inside out to protect the fabric face",
        "Do NOT tumble dry (Hangs dry or lay flat)",
        "Iron on low heat",
        "Do not iron directly on print"
      ],
      careInstructionsAr: [
        "غسيل آلي بارد (٣٠ درجة كحد أقصى)",
        "يغسل مقلوباً للحفاظ على القماش",
        "لا تستخدم المجفف (ينشر ليجف)",
        "كي على درجة حرارة منخفضة",
        "لا تكوي الطباعة مباشرة"
      ]
    }
  },
  {
    slug: "void-heavyweight-hoodie-white",
    data: {
      nameAr: "هودي فويد ثقيل - أبيض",
      description: "Elevate your everyday rotation with the VOID Heavyweight Hoodie. Expertly crafted from 100% premium cotton, this piece offers substantial weight and structure without the use of synthetic blends. The fabric features a high-density 'Sponge' knit construction with a luxuriously soft, brushed interior for natural warmth. Designed with a boxy, oversized silhouette, it provides a clean, premium drape that only pure cotton can achieve.",
      descriptionAr: "مصنوع من صوف ناعم وثقيل الوزن عالي الجودة (350-500 جم)، تم تصميم هذا الهودي ليوفر أقصى درجات الدفء والمتانة. تمنحك تقنية نسيج 'الإسفنج' ملمساً كثيفاً ومنتفخاً يحافظ على شكله، مع بطانة داخلية ناعمة جداً لراحة قصوى. بوزن يصل إلى 1 كجم، إنه قطعة شتوية أساسية صممت لتدوم.",
      
      // SEO English
      metaTitle: "VOID Heavyweight Hoodie - White | Premium Streetwear",
      metaDescription: "Shop the VOID Heavyweight Hoodie in White. 1KG premium brushed cotton fleece for ultimate warmth and structure.",
      
      // SEO Arabic
      metaTitleAr: "هودي فويد أبيض ثقيل | خامة بريميوم",
      metaDescriptionAr: "تسوق هودي فويد الأبيض المصنوع من القطن الثقيل عالي الجودة. إطلالة عصرية وراحة فائقة.",
      
      keywords: "hoodie, white, void, streetwear, heavyweight, cotton, هودي, أبيض, فويد, ملابس شتوية",

      // Detailed Info
      specifications: {
        composition: "100% Cotton",
        compositionAr: "١٠٠٪ قطن",
        fabricType: "Heavyweight Brushed Fleece (Sponge Milton)",
        fabricTypeAr: "ميلتون مبطن ثقيل (سفنج)",
        weightGsm: "350–500 GSM",
        fitType: "Relaxed / Oversized / Boxy",
        fitTypeAr: "مريح / واسع / بوكسي",
        features: [
            "No synthetic blends (100% Natural Fibers)",
            "Soft-brushed interior for high warmth",
            "High-density fabric structure",
            "Dropped shoulders for a streetwear look",
            "Robust ribbed cuffs and hem",
            "Resistant to pilling"
        ],
        featuresAr: [
            "بدون ألياف صناعية (١٠٠٪ ألياف طبيعية)",
            "بطانة ناعمة لتدفئة عالية",
            "نسيج عالي الكثافة",
            "أكتاف منسدلة لمظهر عصري",
            "أساور وحواف متينة",
            "مقاوم للوبر"
        ]
      },
      sizeChart: {
        unit: "cm",
        notes: "Measurements are taken flat. Allow for 1-2cm tolerance.",
        notesAr: "المقاسات مأخوذة والقطعة مسطحة. قد تختلف ١-٢ سم.",
        sizes: [
            { size: "S", chestWidth: 58, bodyLength: 68 },
            { size: "M", chestWidth: 60, bodyLength: 69 },
            { size: "L", chestWidth: 62, bodyLength: 73 },
            { size: "XL", chestWidth: 64, bodyLength: 76 },
            { size: "XXL", chestWidth: 66, bodyLength: 79 }
        ]
      },
      careInstructions: [
        "Machine wash cold (30°C max)",
        "Wash inside out to protect the fabric face",
        "Do NOT tumble dry (Hangs dry or lay flat)",
        "Iron on low heat",
        "Do not iron directly on print"
      ],
      careInstructionsAr: [
        "غسيل آلي بارد (٣٠ درجة كحد أقصى)",
        "يغسل مقلوباً للحفاظ على القماش",
        "لا تستخدم المجفف (ينشر ليجف)",
        "كي على درجة حرارة منخفضة",
        "لا تكوي الطباعة مباشرة"
      ]
    }
  },
  {
    slug: "void-heavyweight-hoodie-grey",
    data: {
      nameAr: "هودي فويد ثقيل - رمادي",
      description: "Elevate your everyday rotation with the VOID Heavyweight Hoodie. Expertly crafted from 100% premium cotton, this piece offers substantial weight and structure without the use of synthetic blends. The fabric features a high-density 'Sponge' knit construction with a luxuriously soft, brushed interior for natural warmth. Designed with a boxy, oversized silhouette, it provides a clean, premium drape that only pure cotton can achieve.",
      descriptionAr: "مصنوع من صوف ناعم وثقيل الوزن عالي الجودة (350-500 جم)، تم تصميم هذا الهودي ليوفر أقصى درجات الدفء والمتانة. تمنحك تقنية نسيج 'الإسفنج' ملمساً كثيفاً ومنتفخاً يحافظ على شكله، مع بطانة داخلية ناعمة جداً لراحة قصوى. بوزن يصل إلى 1 كجم، إنه قطعة شتوية أساسية صممت لتدوم.",
      
      // SEO English
      metaTitle: "VOID Heavyweight Hoodie - Grey | Premium Streetwear",
      metaDescription: "Shop the VOID Heavyweight Hoodie in Grey. 1KG premium brushed cotton fleece for ultimate warmth and structure.",
      
      // SEO Arabic
      metaTitleAr: "هودي فويد رمادي ثقيل | خامة بريميوم",
      metaDescriptionAr: "تسوق هودي فويد الرمادي المصنوع من القطن الثقيل عالي الجودة. تصميم عصري وخامة ممتازة.",
      
      keywords: "hoodie, grey, void, streetwear, heavyweight, cotton, هودي, رمادي, فويد, ملابس شتوية",

      // Detailed Info
      specifications: {
        composition: "100% Cotton",
        compositionAr: "١٠٠٪ قطن",
        fabricType: "Heavyweight Brushed Fleece (Sponge Milton)",
        fabricTypeAr: "ميلتون مبطن ثقيل (سفنج)",
        weightGsm: "350–500 GSM",
        fitType: "Relaxed / Oversized / Boxy",
        fitTypeAr: "مريح / واسع / بوكسي",
        features: [
            "No synthetic blends (100% Natural Fibers)",
            "Soft-brushed interior for high warmth",
            "High-density fabric structure",
            "Dropped shoulders for a streetwear look",
            "Robust ribbed cuffs and hem",
            "Resistant to pilling"
        ],
        featuresAr: [
            "بدون ألياف صناعية (١٠٠٪ ألياف طبيعية)",
            "بطانة ناعمة لتدفئة عالية",
            "نسيج عالي الكثافة",
            "أكتاف منسدلة لمظهر عصري",
            "أساور وحواف متينة",
            "مقاوم للوبر"
        ]
      },
      sizeChart: {
        unit: "cm",
        notes: "Measurements are taken flat. Allow for 1-2cm tolerance.",
        notesAr: "المقاسات مأخوذة والقطعة مسطحة. قد تختلف ١-٢ سم.",
        sizes: [
            { size: "S", chestWidth: 58, bodyLength: 68 },
            { size: "M", chestWidth: 60, bodyLength: 69 },
            { size: "L", chestWidth: 62, bodyLength: 73 },
            { size: "XL", chestWidth: 64, bodyLength: 76 },
            { size: "XXL", chestWidth: 66, bodyLength: 79 }
        ]
      },
      careInstructions: [
        "Machine wash cold (30°C max)",
        "Wash inside out to protect the fabric face",
        "Do NOT tumble dry (Hangs dry or lay flat)",
        "Iron on low heat",
        "Do not iron directly on print"
      ],
      careInstructionsAr: [
        "غسيل آلي بارد (٣٠ درجة كحد أقصى)",
        "يغسل مقلوباً للحفاظ على القماش",
        "لا تستخدم المجفف (ينشر ليجف)",
        "كي على درجة حرارة منخفضة",
        "لا تكوي الطباعة مباشرة"
      ]
    }
  }
];

const updateProducts = async () => {
  await connectDB();
  
  for (const item of updates) {
    const product = await Product.findOneAndUpdate(
      { slug: item.slug },
      { $set: item.data },
      { new: true }
    );
    
    if (product) {
        console.log(`Updated: ${product.name} (${product.slug})`);
    } else {
        console.log(`Failed to find: ${item.slug}`);
    }
  }

  console.log("All updates complete.");
  process.exit();
};

updateProducts();
