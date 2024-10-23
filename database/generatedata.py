import csv

i = "all"
arr =  {
    "Employee 1 - Wei Zhang": [
        "sales strategy", "customer retention", "product launch", "upselling", 
        "APAC market", "cross-department collaboration", "sales pipeline", 
        "team-building", "real-time data", "customer feedback", "negotiation"
    ],
    "Employee 2 - Tao Huang": [
        "product development", "technical review", "user feedback", "cross-functional meeting", 
        "UI/UX design", "performance optimization", "customer demo", "market trends", 
        "troubleshooting", "R&D", "AI-driven features"
    ],
    "Employee 3 - Na Li": [
        "financial review", "budget planning", "internal audit", "investment opportunities", 
        "accounting software", "tax compliance", "financial analysis", "risk assessment", 
        "financial forecast", "performance review", "cost management"
    ],
    "Employee 4 - Tom Cruise": [
        "data analysis", "machine learning", "data visualization", "database optimization", 
        "cloud-based solutions", "customer segmentation", "data security", 
        "real-time analytics", "data ethics", "AI applications", "recommendation system"
    ],
    "Employee 5 - Chris Evans": [
        "front-end development", "UI design", "React", "CSS frameworks", "accessibility", 
        "performance optimization", "API design", "mobile-first design", "WebAssembly", 
        "browser compatibility", "JAMstack"
    ],
    "Employee 6 - Anna Kendrick": [
        "marketing strategy", "social media", "email marketing", "content creation", 
        "competitor analysis", "influencer marketing", "digital assets", 
        "paid advertising", "customer feedback", "ROI", "brand visibility"
    ],
    "Employee 7 - Jason Statham": [
        "recruitment", "HR policies", "leadership development", "diversity and inclusion", 
        "coaching sessions", "compensation benchmarking", "employee engagement", 
        "performance appraisal", "wellness program", "workforce planning"
    ],
    "Employee 8 - Gal Gadot": [
        "API architecture", "database optimization", "caching strategies", "microservices", 
        "security audit", "Docker", "Kubernetes", "CI/CD pipeline", 
        "rate-limiting", "server performance", "automation technology"
    ],
    "Employee 9 - Scarlett Johansson": [
        "client meetings", "customized solutions", "product demonstration", 
        "sales strategy", "networking event", "sales training", "deal closure", 
        "promotional materials", "B2B sales", "customer success", "sales forecast"
    ],
    "Employee 10 - Dwayne Johnson": [
        "logistics operations", "warehouse management", "inventory management", 
        "safety protocols", "distribution network", "transportation costs", 
        "supply chain optimization", "vendor management", "fleet management", 
        "operational improvements", "automation"
    ]
}




with open("./generatereports/emp"+str(i)+".csv",'w', newline="") as f:
    f1 = csv.writer(f)
    for x in arr.values():
        f1.writerow([",".join(x)])