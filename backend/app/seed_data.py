"""
Sample Product Dataset & Database Seeding for SmartCommerce AI
==============================================================
Populates the SQLite database with realistic e-commerce products
priced in Indian Rupees (₹), categorized across Laptops, Smartphones,
Audio, Accessories, and Monitors.
"""

import json
from sqlalchemy.orm import Session
from .models import Product

SAMPLE_PRODUCTS = [
    # ------------------ LAPTOPS (Coding, Gaming, Everyday) ------------------
    {
        "name": "Lenovo IdeaPad Slim 3 (AMD Ryzen 7 5700U / 16GB / 512GB SSD / Win 11)",
        "brand": "Lenovo",
        "category": "Laptops",
        "price": 54990.0,
        "original_price": 68990.0,
        "rating": 4.5,
        "review_count": 1420,
        "description": "Ideal laptop for coding, web development, and multitasking. Features an 8-core AMD Ryzen 7 processor with 16GB DDR4 RAM, fast NVMe SSD, and anti-glare FHD IPS display.",
        "features": [
            "AMD Ryzen 7 5700U (8 cores, 16 threads up to 4.3 GHz)",
            "16GB DDR4 RAM (Smooth compilation & Docker containers)",
            "512GB PCIe NVMe M.2 SSD fast boot",
            "15.6 inch FHD IPS Anti-Glare Display (Eye Care Mode)",
            "Up to 8 hours battery life with Rapid Charge",
            "Backlit Keyboard & Fingerprint Reader"
        ],
        "specs": {
            "Processor": "AMD Ryzen 7 5700U",
            "RAM": "16 GB DDR4",
            "Storage": "512 GB NVMe SSD",
            "Display": "15.6\" FHD (1920x1080) IPS",
            "Battery": "Up to 8 Hours",
            "Weight": "1.65 kg",
            "OS": "Windows 11 Home"
        },
        "tags": ["laptop", "coding", "programming", "developer", "student", "fast", "multitasking", "budget", "lenovo", "ryzen 7", "16gb ram"],
        "image_url": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
        "in_stock": True,
        "is_featured": True
    },
    {
        "name": "ASUS Vivobook 16X (Intel Core i5-12500H / 16GB / 512GB SSD / 16-inch 120Hz)",
        "brand": "ASUS",
        "category": "Laptops",
        "price": 58990.0,
        "original_price": 74990.0,
        "rating": 4.6,
        "review_count": 890,
        "description": "Powerhouse for software engineering, full-stack development, and data science. High-performance H-series Intel Core i5 12th Gen processor paired with a crisp 16-inch 16:10 screen.",
        "features": [
            "Intel Core i5-12500H (12 Cores, 16 Threads, 4.5 GHz Max Boost)",
            "16GB DDR4 RAM (Upgradable to 24GB)",
            "512GB M.2 NVMe PCIe 3.0 SSD",
            "16.0-inch WUXGA (1920 x 1200) 16:10 aspect ratio, 300 nits",
            "Military Grade Durability (MIL-STD 810H)",
            "IceBlade fan cooling system"
        ],
        "specs": {
            "Processor": "Intel Core i5-12500H (12 Cores)",
            "RAM": "16 GB DDR4",
            "Storage": "512 GB PCIe SSD",
            "Display": "16\" WUXGA 16:10 120Hz",
            "Battery": "50WHrs (6-7 Hours)",
            "Weight": "1.8 kg",
            "OS": "Windows 11 + MS Office 2021"
        },
        "tags": ["laptop", "coding", "programming", "intel", "i5", "developer", "engineering", "asus", "16gb", "under 60000"],
        "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
        "in_stock": True,
        "is_featured": True
    },
    {
        "name": "HP Pavilion 15 (Intel Core i5 13th Gen / 16GB / 512GB SSD / B&O Audio)",
        "brand": "HP",
        "category": "Laptops",
        "price": 63990.0,
        "original_price": 79990.0,
        "rating": 4.4,
        "review_count": 1150,
        "description": "Premium aluminum build with high performance for developers and business professionals. Audio by Bang & Olufsen with HP fast charge.",
        "features": [
            "13th Gen Intel Core i5-1335U processor",
            "16GB DDR4-3200 MHz RAM",
            "512GB PCIe NVMe M.2 SSD",
            "FHD micro-edge IPS anti-glare display",
            "HP Wide Vision 720p HD camera with temporal noise reduction"
        ],
        "specs": {
            "Processor": "Intel Core i5-1335U 10-core",
            "RAM": "16 GB DDR4",
            "Storage": "512 GB SSD",
            "Display": "15.6\" FHD IPS",
            "Weight": "1.75 kg",
            "OS": "Windows 11"
        },
        "tags": ["laptop", "coding", "hp", "programming", "business", "office", "student", "intel i5"],
        "image_url": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80",
        "in_stock": True,
        "is_featured": False
    },
    {
        "name": "Acer Aspire 5 Gaming Laptop (Intel i5 12th Gen / RTX 2050 4GB / 16GB / 512GB SSD)",
        "brand": "Acer",
        "category": "Laptops",
        "price": 52990.0,
        "original_price": 69990.0,
        "rating": 4.3,
        "review_count": 920,
        "description": "Entry gaming and development laptop featuring dedicated NVIDIA GeForce RTX 2050 graphics. Great for machine learning, game development, and coding.",
        "features": [
            "Intel Core i5-1240P 12-Core processor",
            "NVIDIA GeForce RTX 2050 (4GB GDDR6 VRAM)",
            "16GB Dual-channel DDR4 RAM",
            "512GB PCIe Gen4 SSD",
            "Thunderbolt 4 support and Wi-Fi 6E"
        ],
        "specs": {
            "Processor": "Intel Core i5-1240P",
            "GPU": "NVIDIA RTX 2050 4GB",
            "RAM": "16 GB DDR4",
            "Storage": "512 GB NVMe SSD",
            "Weight": "1.8 kg"
        },
        "tags": ["laptop", "gaming", "coding", "machine learning", "rtx", "acer", "budget", "under 60000"],
        "image_url": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
        "in_stock": True,
        "is_featured": True
    },
    {
        "name": "Apple MacBook Air M2 (8GB Unified Memory / 256GB SSD / Liquid Retina)",
        "brand": "Apple",
        "category": "Laptops",
        "price": 94900.0,
        "original_price": 99900.0,
        "rating": 4.9,
        "review_count": 3100,
        "description": "Incredibly thin and fast MacBook Air powered by the next-generation M2 chip. Up to 18 hours of battery life with silent, fanless design.",
        "features": [
            "Apple M2 chip with 8-core CPU and 8-core GPU",
            "13.6-inch Liquid Retina display with True Tone",
            "Up to 18 hours of all-day battery life",
            "1080p FaceTime HD camera and three-mic array",
            "MagSafe 3 charging and two Thunderbolt ports"
        ],
        "specs": {
            "Processor": "Apple M2 8-Core",
            "RAM": "8 GB Unified Memory",
            "Storage": "256 GB SSD",
            "Display": "13.6\" Liquid Retina",
            "Battery": "Up to 18 Hours",
            "Weight": "1.24 kg",
            "OS": "macOS Sonoma"
        },
        "tags": ["laptop", "apple", "macbook", "ios", "coding", "lightweight", "premium", "battery life"],
        "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
        "in_stock": True,
        "is_featured": True
    },
    {
        "name": "Dell 15 Thin & Light (Intel Core i3 12th Gen / 8GB / 512GB SSD / 15.6\" FHD)",
        "brand": "Dell",
        "category": "Laptops",
        "price": 36990.0,
        "original_price": 46990.0,
        "rating": 4.1,
        "review_count": 680,
        "description": "Affordable and reliable everyday laptop for students, basic Python learning, web browsing, and office work.",
        "features": [
            "Intel Core i3-1215U 6-core processor",
            "8GB DDR4 RAM (Expandable to 16GB)",
            "512GB M.2 PCIe NVMe Solid State Drive",
            "15.6-inch FHD (1920 x 1080) 120Hz display",
            "ExpressCharge 80% in 60 minutes"
        ],
        "specs": {
            "Processor": "Intel Core i3-1215U",
            "RAM": "8 GB DDR4",
            "Storage": "512 GB SSD",
            "Display": "15.6\" FHD 120Hz",
            "Weight": "1.68 kg"
        },
        "tags": ["laptop", "budget", "student", "dell", "under 40000", "basic coding", "office"],
        "image_url": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80",
        "in_stock": True,
        "is_featured": False
    },

    # ------------------ SMARTPHONES (Camera, Battery, Performance) ------------------
    {
        "name": "OnePlus Nord CE 4 5G (8GB RAM / 128GB Storage / 100W SuperVOOC)",
        "brand": "OnePlus",
        "category": "Smartphones",
        "price": 24999.0,
        "original_price": 27999.0,
        "rating": 4.5,
        "review_count": 2300,
        "description": "Smooth performance with Snapdragon 7 Gen 3, Sony LYT-600 OIS camera, massive 5500mAh battery, and blistering 100W charging.",
        "features": [
            "Qualcomm Snapdragon 7 Gen 3 chipset",
            "50MP Sony LYT-600 Camera with OIS",
            "5500 mAh battery with 100W fast charging (1-100% in 29 mins)",
            "6.7-inch 120Hz AMOLED display with HDR10+",
            "OxygenOS 14 with Aqua Dynamics"
        ],
        "specs": {
            "Processor": "Snapdragon 7 Gen 3",
            "RAM": "8 GB LPDDR4X",
            "Storage": "128 GB UFS 3.1",
            "Camera": "50MP OIS + 8MP Ultra-wide",
            "Battery": "5500 mAh (100W)",
            "Display": "6.7\" 120Hz AMOLED"
        },
        "tags": ["smartphone", "phone", "oneplus", "5g", "fast charging", "battery", "camera", "under 30000"],
        "image_url": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=600&q=80",
        "in_stock": True,
        "is_featured": True
    },
    {
        "name": "Samsung Galaxy S23 FE 5G (8GB RAM / 128GB Storage / Flagship Camera)",
        "brand": "Samsung",
        "category": "Smartphones",
        "price": 38999.0,
        "original_price": 54999.0,
        "rating": 4.6,
        "review_count": 1850,
        "description": "Flagship experience with iconic design, pro-grade 50MP triple camera system, IP68 water resistance, and vibrant Dynamic AMOLED 2X display.",
        "features": [
            "50MP High-Resolution Camera with 3x Optical Zoom",
            "Dynamic AMOLED 2X Display with 120Hz adaptive refresh rate",
            "Exynos 2200 4nm high performance chip",
            "IP68 Water and Dust Resistance rating",
            "Samsung Knox security and 4 years of OS updates"
        ],
        "specs": {
            "Processor": "Exynos 2200 (4nm)",
            "RAM": "8 GB",
            "Storage": "128 GB",
            "Camera": "50MP Main + 12MP Ultra-wide + 8MP Telephoto (3x)",
            "Display": "6.4\" Dynamic AMOLED 2X",
            "Battery": "4500 mAh"
        },
        "tags": ["smartphone", "phone", "samsung", "camera", "flagship", "galaxy", "5g", "under 40000", "photography"],
        "image_url": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80",
        "in_stock": True,
        "is_featured": True
    },
    {
        "name": "Redmi Note 13 Pro+ 5G (12GB RAM / 256GB / 200MP OIS Camera)",
        "brand": "Redmi",
        "category": "Smartphones",
        "price": 29999.0,
        "original_price": 35999.0,
        "rating": 4.4,
        "review_count": 2100,
        "description": "Feature-packed device with curved 1.5K AMOLED display, 200MP ultra-clear camera, IP68 rating, and 120W HyperCharge.",
        "features": [
            "200MP Samsung ISOCELL HP3 camera with OIS & EIS",
            "120W HyperCharge (100% in 19 mins)",
            "1.5K 120Hz Curved AMOLED 3D Display (1800 nits peak)",
            "MediaTek Dimensity 7200-Ultra (4nm)",
            "Corning Gorilla Glass Victus front"
        ],
        "specs": {
            "Processor": "Dimensity 7200-Ultra",
            "RAM": "12 GB",
            "Storage": "256 GB",
            "Camera": "200MP OIS Camera",
            "Battery": "5000 mAh (120W)",
            "Display": "6.67\" 1.5K Curved AMOLED"
        },
        "tags": ["smartphone", "phone", "redmi", "xiaomi", "200mp", "camera", "fast charge", "under 30000"],
        "image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02597?auto=format&fit=crop&w=600&q=80",
        "in_stock": True,
        "is_featured": False
    },

    # ------------------ AUDIO & HEADPHONES ------------------
    {
        "name": "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
        "brand": "Sony",
        "category": "Audio",
        "price": 19990.0,
        "original_price": 29990.0,
        "rating": 4.8,
        "review_count": 4500,
        "description": "Industry-leading active noise cancellation with premium sound quality. Perfect for coding, deep focus, office work, and long flights.",
        "features": [
            "HD Noise Cancelling Processor QN1 & Dual Noise Sensor",
            "Up to 30 hours battery life with quick charging (5 hrs from 10 mins)",
            "Speak-to-Chat & Wear Detection technology",
            "Multipoint connection: Pair two Bluetooth devices simultaneously",
            "LDAC support for High-Resolution wireless audio"
        ],
        "specs": {
            "Type": "Over-Ear Wireless",
            "Battery Life": "30 Hours (ANC ON)",
            "Noise Cancellation": "Active Noise Cancellation (ANC)",
            "Connectivity": "Bluetooth 5.0 / 3.5mm Aux",
            "Weight": "254 g",
            "Microphone": "Built-in with Voice Pickup"
        },
        "tags": ["audio", "headphones", "sony", "anc", "noise cancelling", "coding", "focus", "wireless", "premium", "travel"],
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        "in_stock": True,
        "is_featured": True
    },
    {
        "name": "Sony WF-C700N True Wireless Noise Cancelling Earbuds",
        "brand": "Sony",
        "category": "Audio",
        "price": 6990.0,
        "original_price": 9990.0,
        "rating": 4.4,
        "review_count": 1280,
        "description": "Comfortable, lightweight earbuds with digital noise cancelling, punchy bass with DSEE, and clear hands-free calls.",
        "features": [
            "Digital Noise Cancelling and Ambient Sound Mode",
            "Ergonomic compact design for all-day comfort",
            "Up to 15 hours battery life with charging case",
            "IPX4 water resistance for sweat & workouts",
            "Multipoint connection support"
        ],
        "specs": {
            "Type": "True Wireless Earbuds",
            "Battery Life": "7.5h + 7.5h (Case)",
            "Water Resistance": "IPX4",
            "Connectivity": "Bluetooth 5.2",
            "Driver": "5 mm"
        },
        "tags": ["audio", "earbuds", "sony", "tws", "wireless", "noise cancelling", "budget", "under 10000", "workout"],
        "image_url": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
        "in_stock": True,
        "is_featured": False
    },
    {
        "name": "boAt Rockerz 450 Bluetooth On-Ear Headphones with Mic",
        "brand": "boAt",
        "category": "Audio",
        "price": 1499.0,
        "original_price": 3990.0,
        "rating": 4.2,
        "review_count": 9800,
        "description": "Super affordable on-ear wireless headphones with deep HD bass, plush ear cushions, and 15-hour playback.",
        "features": [
            "40mm dynamic drivers for HD audio & immersive bass",
            "Up to 15 hours of nonstop battery playback",
            "Ergonomically designed with comfortable padded earcups",
            "Dual modes: Wireless Bluetooth and Wired Aux"
        ],
        "specs": {
            "Type": "On-Ear Wireless",
            "Battery Life": "15 Hours",
            "Driver": "40 mm",
            "Connectivity": "Bluetooth 5.0 & 3.5mm Aux",
            "Weight": "168 g"
        },
        "tags": ["audio", "headphones", "boat", "budget", "cheap", "under 2000", "bass", "student"],
        "image_url": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
        "in_stock": True,
        "is_featured": False
    },

    # ------------------ ACCESSORIES & PERIPHERALS ------------------
    {
        "name": "Logitech MX Master 3S Wireless Performance Mouse",
        "brand": "Logitech",
        "category": "Accessories",
        "price": 8995.0,
        "original_price": 10995.0,
        "rating": 4.9,
        "review_count": 3400,
        "description": "The ultimate mouse for coders, designers, and power users. Features 8K DPI glass tracking, quiet clicks, and MagSpeed electromagnetic scrolling.",
        "features": [
            "MagSpeed Electromagnetic Scrolling (1000 lines per second)",
            "8,000 DPI track-on-glass optical sensor",
            "Quiet Click switches (90% less noise)",
            "Ergonomic hand sculpted design with thumb rest & gesture button",
            "Easy-Switch between 3 devices & Logitech Flow"
        ],
        "specs": {
            "DPI": "200 to 8000 DPI",
            "Battery": "Up to 70 days on full charge (USB-C)",
            "Connectivity": "Bluetooth Low Energy & Logi Bolt",
            "Buttons": "7 customizable buttons",
            "Weight": "141 g"
        },
        "tags": ["mouse", "accessories", "logitech", "coding", "ergonomic", "developer", "productivity", "wireless", "office"],
        "image_url": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80",
        "in_stock": True,
        "is_featured": True
    },
    {
        "name": "Keychron K2 V2 Wireless Mechanical Keyboard (Gateron Brown)",
        "brand": "Keychron",
        "category": "Accessories",
        "price": 7499.0,
        "original_price": 8999.0,
        "rating": 4.8,
        "review_count": 1650,
        "description": "75% compact wireless mechanical keyboard designed for Mac and Windows. Tactile Gateron Brown switches ideal for programming and typing speed.",
        "features": [
            "75% Layout (84 keys) saving desk space",
            "Tactile Gateron G Pro Brown mechanical switches",
            "Connects up to 3 devices via Bluetooth or Type-C cable",
            "4000 mAh large rechargeable battery (up to 240 hours)",
            "RGB Backlighting with 18 lighting modes"
        ],
        "specs": {
            "Switch Type": "Gateron Brown (Tactile)",
            "Layout": "75% Compact (84 keys)",
            "Battery": "4000 mAh",
            "Compatibility": "Mac / Windows / iOS / Android",
            "Backlight": "RGB Multi-color"
        },
        "tags": ["keyboard", "mechanical keyboard", "accessories", "keychron", "coding", "developer", "typing", "rgb", "bluetooth"],
        "image_url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
        "in_stock": True,
        "is_featured": True
    },
    {
        "name": "Portronics Toad 23 Wireless Optical Mouse (2.4GHz / Silent Clicks)",
        "brand": "Portronics",
        "category": "Accessories",
        "price": 299.0,
        "original_price": 599.0,
        "rating": 4.0,
        "review_count": 4200,
        "description": "Compact, travel-friendly wireless mouse with silent clicks and high precision optical sensor for everyday laptop use.",
        "features": [
            "2.4 GHz wireless nano USB receiver (10m range)",
            "Silent micro-switches for noiseless working",
            "Up to 1600 DPI tracking speed",
            "Ergonomic ambidextrous grip"
        ],
        "specs": {
            "DPI": "1200 - 1600 DPI",
            "Connectivity": "2.4 GHz Wireless USB",
            "Battery": "1x AA Battery (up to 6 months)",
            "Weight": "65 g"
        },
        "tags": ["mouse", "budget", "accessories", "wireless", "cheap", "under 500", "portronics"],
        "image_url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80",
        "in_stock": True,
        "is_featured": False
    },

    # ------------------ MONITORS ------------------
    {
        "name": "LG 27-inch 4K UHD IPS Monitor (27UL500 / HDR10 / sRGB 98% / FreeSync)",
        "brand": "LG",
        "category": "Monitors",
        "price": 23999.0,
        "original_price": 32000.0,
        "rating": 4.7,
        "review_count": 940,
        "description": "Sharp 4K UHD resolution ideal for multi-window coding, video editing, and crisp font rendering with Radeon FreeSync.",
        "features": [
            "27-inch 4K UHD (3840 x 2160) IPS panel",
            "HDR10 with 98% sRGB color gamut coverage",
            "Dual HDMI and DisplayPort connectivity",
            "AMD FreeSync & Game Mode",
            "Custom split-screen with OnScreen Control software"
        ],
        "specs": {
            "Screen Size": "27 Inch",
            "Resolution": "4K UHD (3840 x 2160)",
            "Panel Type": "IPS",
            "Refresh Rate": "60 Hz",
            "Ports": "2x HDMI, 1x DisplayPort, Headphone Out"
        },
        "tags": ["monitor", "4k", "lg", "ips", "coding", "developer", "dual screen", "display", "under 25000"],
        "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
        "in_stock": True,
        "is_featured": True
    },
    {
        "name": "Samsung 24-inch FHD Flat Monitor with Borderless Design (75Hz / IPS)",
        "brand": "Samsung",
        "category": "Monitors",
        "price": 7999.0,
        "original_price": 13500.0,
        "rating": 4.4,
        "review_count": 3100,
        "description": "Sleek 3-sided borderless design with 75Hz refresh rate and AMD FreeSync for smooth work and coding setups on a budget.",
        "features": [
            "24-inch Full HD (1920x1080) IPS display with 178° viewing angles",
            "75Hz refresh rate with AMD FreeSync",
            "Eye Saver Mode & Flicker Free technology",
            "HDMI & D-sub (VGA) ports"
        ],
        "specs": {
            "Screen Size": "24 Inch",
            "Resolution": "Full HD (1920 x 1080)",
            "Panel Type": "IPS",
            "Refresh Rate": "75 Hz",
            "Ports": "1x HDMI, 1x VGA"
        },
        "tags": ["monitor", "samsung", "budget", "under 10000", "coding", "fhd", "ips", "student"],
        "image_url": "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80",
        "in_stock": True,
        "is_featured": False
    }
]

def seed_database_if_empty(db: Session):
    """
    Checks if products exist in database. If empty, populates from SAMPLE_PRODUCTS.
    """
    count = db.query(Product).count()
    if count == 0:
        print("[INFO] Seeding database with initial products...")
        for item in SAMPLE_PRODUCTS:
            product = Product(
                name=item["name"],
                brand=item["brand"],
                category=item["category"],
                price=item["price"],
                original_price=item.get("original_price"),
                rating=item["rating"],
                review_count=item["review_count"],
                description=item["description"],
                features=json.dumps(item.get("features", [])),
                specs=json.dumps(item.get("specs", {})),
                tags=",".join(item.get("tags", [])),
                image_url=item.get("image_url"),
                in_stock=item.get("in_stock", True),
                is_featured=item.get("is_featured", False)
            )
            db.add(product)
        db.commit()
        print(f"[OK] Successfully seeded {len(SAMPLE_PRODUCTS)} products into SQLite database.")
    else:
        print(f"[INFO] Database already contains {count} products. Skipping seed.")
