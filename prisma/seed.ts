import { PrismaClient } from "@/app/generated/prisma/client"
import prisma from "@/lib/prisma"


async function main() {
  
  const categories = [
    {
      name: "Electronics",
      desc: "Shop latest electronic gadgets, devices, and accessories from top brands.",
      metaTitle: "Electronics Online – Buy Gadgets & Devices",
      metaDesc: "Buy mobiles, laptops, accessories, and electronic devices at best prices.",
      keywords: "electronics, gadgets, devices, mobiles, laptops",
    },
    {
      name: "Clothing & Fashion",
      desc: "Trendy clothing and fashion wear for men, women, and kids.",
      metaTitle: "Clothing & Fashion – Latest Trends Online",
      metaDesc: "Explore latest fashion, clothing, and apparel for all seasons.",
      keywords: "clothing, fashion, apparel, men wear, women wear",
    },
    {
      name: "Footwear",
      desc: "Comfortable and stylish footwear for all occasions.",
      metaTitle: "Footwear Online – Shoes, Sandals & More",
      metaDesc: "Shop footwear for men, women, and kids at affordable prices.",
      keywords: "footwear, shoes, sandals, slippers",
    },
    {
      name: "Home",
      desc: "Essential products to make your home comfortable and stylish.",
      metaTitle: "Home Essentials & Decor Online",
      metaDesc: "Buy home essentials, decor, and utility products online.",
      keywords: "home essentials, home decor",
    },
    {
      name: "Furniture",
      desc: "Modern and durable furniture for home and office.",
      metaTitle: "Furniture Online – Home & Office Furniture",
      metaDesc: "Shop sofas, beds, tables, and office furniture online.",
      keywords: "furniture, sofa, bed, table",
    },
    {
      name: "Kitchen",
      desc: "Kitchen tools, cookware, and appliances for everyday cooking.",
      metaTitle: "Kitchen Products & Cookware Online",
      metaDesc: "Buy kitchen essentials, cookware, and appliances online.",
      keywords: "kitchen, cookware, utensils",
    },
    {
      name: "Beauty",
      desc: "Beauty and skincare products from trusted brands.",
      metaTitle: "Beauty Products – Skincare & Makeup",
      metaDesc: "Shop beauty, skincare, and makeup products online.",
      keywords: "beauty, skincare, makeup",
    },
    {
      name: "Personal Care",
      desc: "Personal hygiene and grooming products for daily use.",
      metaTitle: "Personal Care & Hygiene Products",
      metaDesc: "Buy personal care and hygiene products online.",
      keywords: "personal care, hygiene, grooming",
    },
    {
      name: "Grocery",
      desc: "Daily grocery and food essentials delivered to your doorstep.",
      metaTitle: "Online Grocery Store – Daily Essentials",
      metaDesc: "Shop groceries, food items, and daily essentials online.",
      keywords: "grocery, food, daily essentials",
    },
    {
      name: "Health",
      desc: "Health and wellness products for a better lifestyle.",
      metaTitle: "Health & Wellness Products Online",
      metaDesc: "Buy healthcare and wellness products online.",
      keywords: "health, wellness, medical",
    },
    {
      name: "Sports",
      desc: "Sports equipment and accessories for indoor and outdoor games.",
      metaTitle: "Sports Equipment & Accessories",
      metaDesc: "Shop sports gear and accessories online.",
      keywords: "sports, equipment, accessories",
    },
    {
      name: "Fitness",
      desc: "Fitness equipment and supplements for workouts and training.",
      metaTitle: "Fitness & Gym Products Online",
      metaDesc: "Buy fitness equipment and workout essentials online.",
      keywords: "fitness, gym, workout",
    },
    {
      name: "Books",
      desc: "Books across education, fiction, non-fiction, and competitive exams.",
      metaTitle: "Books Online – Educational & Fiction",
      metaDesc: "Shop books from all genres online.",
      keywords: "books, novels, education",
    },
    {
      name: "Stationery",
      desc: "School and office stationery supplies.",
      metaTitle: "Stationery & Office Supplies Online",
      metaDesc: "Buy stationery and office supplies online.",
      keywords: "stationery, office supplies",
    },
    {
      name: "Toys",
      desc: "Fun and educational toys for kids of all ages.",
      metaTitle: "Toys & Games for Kids",
      metaDesc: "Shop toys and games for children online.",
      keywords: "toys, kids, games",
    },
    {
      name: "Baby Products",
      desc: "Safe and reliable baby care and infant products.",
      metaTitle: "Baby Products & Baby Care Essentials",
      metaDesc: "Buy baby care and infant products online.",
      keywords: "baby products, infant care",
    },
    {
      name: "Automotive",
      desc: "Automotive accessories and spare parts for cars and bikes.",
      metaTitle: "Automotive Accessories & Parts",
      metaDesc: "Shop car and bike accessories online.",
      keywords: "automotive, car accessories, bike accessories",
    },
    {
      name: "Appliances",
      desc: "Home and kitchen appliances for everyday needs.",
      metaTitle: "Home & Kitchen Appliances Online",
      metaDesc: "Buy large and small appliances online.",
      keywords: "appliances, home appliances",
    },
    {
      name: "Tools",
      desc: "Tools and hardware products for home and professional use.",
      metaTitle: "Tools & Hardware Products Online",
      metaDesc: "Shop tools and hardware equipment online.",
      keywords: "tools, hardware",
    },
    {
      name: "Office Supplies",
      desc: "Office essentials for businesses and workspaces.",
      metaTitle: "Office Supplies & Equipment",
      metaDesc: "Buy office supplies and equipment online.",
      keywords: "office supplies, office equipment",
    },
    {
      name: "Jewelry",
      desc: "Gold, silver, and fashion jewelry collections.",
      metaTitle: "Jewelry Online – Gold & Fashion Jewelry",
      metaDesc: "Shop jewelry for all occasions online.",
      keywords: "jewelry, gold, silver",
    },
    {
      name: "Watches",
      desc: "Watches and smartwatches for men and women.",
      metaTitle: "Watches & Smartwatches Online",
      metaDesc: "Buy branded watches and smartwatches online.",
      keywords: "watches, smartwatches",
    },
    {
      name: "Bags & Luggage",
      desc: "Bags, backpacks, and luggage for travel and daily use.",
      metaTitle: "Bags & Luggage Online",
      metaDesc: "Shop travel bags and luggage online.",
      keywords: "bags, luggage, backpacks",
    },
    {
      name: "Digital Products",
      desc: "Downloadable digital products like software and e-books.",
      metaTitle: "Digital Products & Downloads",
      metaDesc: "Buy digital products and downloads online.",
      keywords: "digital products, software, ebooks",
    },
    {
      name: "Gifts & Seasonal",
      desc: "Gift items and seasonal products for special occasions.",
      metaTitle: "Gifts & Seasonal Products Online",
      metaDesc: "Shop gifts and seasonal items online.",
      keywords: "gifts, seasonal, festival",
    },
  ]
  await prisma.category.createMany({
    data: categories.map((c) => ({
      categoryName: c.name,
      description: c.desc,
      metaTitle: c.metaTitle,
      metaDescription: c.metaDesc,
      metaKeywords: c.keywords,
    })),
    skipDuplicates: true,
  })

  console.log("✅ Categories with SEO metadata inserted successfully")
}

main()
  .catch((e) => {
    console.error(e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
