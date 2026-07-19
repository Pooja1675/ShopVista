export function seedData() {
  const users = [
    { id: 'customer1', name: 'Customer', email: 'customer@shopvista.com', password: 'password123', role: 'customer', avatar: '👤' },
    { id: 'seller1', name: 'ShopVista Store', email: 'seller@shopvista.com', password: 'seller123', role: 'seller', avatar: '🏪' }
  ];
  localStorage.setItem('shopvista_users', JSON.stringify(users));

  const products = [
    {
      id: 'p1', name: 'Sony WH-1000XM5 Wireless Headphones', description: 'Industry-leading noise canceling with two processors and eight microphones.', features: ['Auto Noise Canceling Optimizer', '30-hour battery life', 'Multi-point connection'], specifications: { 'Brand': 'Sony', 'Weight': '250g', 'Connectivity': 'Bluetooth 5.2' }, images: ['assets/images/img_f3v9fafn3.jpg'], price: 29990, originalPrice: 34990, discount: 14, rating: 4.8, reviewCount: 1234,
      reviews: [{ id: 'r1', userName: 'Rahul S.', rating: 5, title: 'Best ANC headphones', comment: 'The noise cancellation is unreal!', date: '2024-12-15', helpful: 42 }],
      seller: { id: 'seller1', name: 'ShopVista Store' }, category: 'Electronics', subcategory: 'Audio', brand: 'Sony', stock: 45, tags: ['wireless', 'headphones', 'sony']
    },
    {
      id: 'p2', name: 'Garmin Fenix 7 Sapphire Solar', description: 'Rugged multisport GPS watch with solar charging lens.', features: ['Built-in sports apps', 'Heart rate & Pulse Ox', 'Up to 22 days battery'], specifications: { 'Brand': 'Garmin', 'Screen': '1.3"', 'Water Rating': '10 ATM' }, images: ['assets/images/img_m7j0h97fm.jpg'], price: 74990, originalPrice: 89990, discount: 16, rating: 4.7, reviewCount: 456,
      reviews: [{ id: 'r2', userName: 'Amit K.', rating: 5, title: 'Beast of a watch', comment: 'Battery lasts forever.', date: '2024-11-20', helpful: 12 }],
      seller: { id: 'seller1', name: 'ShopVista Store' }, category: 'Electronics', subcategory: 'Wearables', brand: 'Garmin', stock: 120, tags: ['smartwatch', 'fitness', 'garmin']
    },
    {
      id: 'p3', name: 'Apple MacBook Pro M3 (14-inch)', description: 'Mind-blowing. Head-turning. The most advanced Mac ever.', features: ['M3 chip with 8-core CPU', '14.2-inch Liquid Retina XDR', 'Up to 22 hours battery'], specifications: { 'Brand': 'Apple', 'RAM': '16GB', 'Storage': '512GB SSD' }, images: ['assets/images/img_bdqxgxmdw.jpg'], price: 169900, originalPrice: 169900, discount: 0, rating: 4.9, reviewCount: 890,
      reviews: [{ id: 'r3', userName: 'Priya M.', rating: 5, title: 'Incredible performance', comment: 'Compiles code instantly.', date: '2025-01-05', helpful: 30 }],
      seller: { id: 'seller1', name: 'ShopVista Store' }, category: 'Electronics', subcategory: 'Computers', brand: 'Apple', stock: 20, tags: ['laptop', 'macbook', 'apple']
    },
    {
      id: 'p4', name: 'Apple iPhone 15 Pro Max', description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip.', features: ['Titanium design', 'A17 Pro chip', '48MP Main camera'], specifications: { 'Brand': 'Apple', 'Screen': '6.7"', 'Storage': '256GB' }, images: ['assets/images/img_itcp5us1w.jpg'], price: 159900, originalPrice: 159900, discount: 0, rating: 4.8, reviewCount: 3400,
      reviews: [{ id: 'r4', userName: 'Vikas B.', rating: 5, title: 'Amazing camera', comment: 'The zoom is incredible.', date: '2024-10-12', helpful: 122 }],
      seller: { id: 'seller1', name: 'ShopVista Store' }, category: 'Electronics', subcategory: 'Mobiles', brand: 'Apple', stock: 85, tags: ['smartphone', 'mobile', 'iphone']
    },
    {
      id: 'p5', name: 'Sony Alpha A7 IV Mirrorless Camera', description: 'True hybrid with 33MP full-frame sensor and 4K 60p video.', features: ['33MP Full-Frame Exmor R', 'BIONZ XR processor', 'Real-time Eye AF'], specifications: { 'Brand': 'Sony', 'Lens Mount': 'E-Mount', 'Weight': '658g' }, images: ['assets/images/img_bi5y3mrpe.jpg'], price: 214990, originalPrice: 224990, discount: 4, rating: 4.9, reviewCount: 212,
      reviews: [{ id: 'r5', userName: 'Sanjay', rating: 5, title: 'Perfect for video & photo', comment: 'Autofocus is unmatched.', date: '2024-09-08', helpful: 45 }],
      seller: { id: 'seller1', name: 'ShopVista Store' }, category: 'Electronics', subcategory: 'Cameras', brand: 'Sony', stock: 15, tags: ['camera', 'photography', 'sony']
    },
    {
      id: 'p6', name: 'Calvin Klein Crew Neck T-Shirt', description: 'Pure cotton classic fit crew neck tee.', features: ['100% Cotton', 'Classic Fit', 'Machine Washable'], specifications: { 'Brand': 'Calvin Klein', 'Color': 'White', 'Size': 'M, L, XL' }, images: ['assets/images/img_nrq64yyf1.jpg'], price: 1499, originalPrice: 2499, discount: 40, rating: 4.3, reviewCount: 560,
      reviews: [{ id: 'r6', userName: 'Neha', rating: 4, title: 'Good basic tee', comment: 'Soft and comfortable.', date: '2025-02-10', helpful: 5 }],
      seller: { id: 'seller1', name: 'ShopVista Store' }, category: 'Fashion', subcategory: 'Men', brand: 'Calvin Klein', stock: 200, tags: ['tshirt', 'clothing', 'men']
    },
    {
      id: 'p7', name: 'Zara Floral Midi Dress', description: 'Flowy midi dress with an all-over floral print.', features: ['V-neckline', 'Short sleeves', 'Button-up front'], specifications: { 'Brand': 'Zara', 'Material': 'Viscose', 'Length': 'Midi' }, images: ['assets/images/img_wknepy0la.jpg'], price: 2990, originalPrice: 3990, discount: 25, rating: 4.5, reviewCount: 120,
      reviews: [{ id: 'r7', userName: 'Anjali', rating: 5, title: 'Beautiful summer dress', comment: 'Very flattering fit.', date: '2024-12-01', helpful: 18 }],
      seller: { id: 'seller1', name: 'ShopVista Store' }, category: 'Fashion', subcategory: 'Women', brand: 'Zara', stock: 60, tags: ['dress', 'women', 'summer']
    },
    {
      id: 'p8', name: 'Nike Air Force 1 \'07', description: 'The radiance lives on in the Nike Air Force 1 \'07.', features: ['Leather upper', 'Nike Air cushioning', 'Low-cut silhouette'], specifications: { 'Brand': 'Nike', 'Color': 'White', 'Closure': 'Lace-up' }, images: ['assets/images/img_iwnraorsp.jpg'], price: 7495, originalPrice: 7495, discount: 0, rating: 4.8, reviewCount: 3100,
      reviews: [{ id: 'r8', userName: 'Rohan', rating: 5, title: 'Classic', comment: 'Goes with everything.', date: '2025-01-22', helpful: 25 }],
      seller: { id: 'seller1', name: 'ShopVista Store' }, category: 'Fashion', subcategory: 'Footwear', brand: 'Nike', stock: 150, tags: ['shoes', 'sneakers', 'nike']
    },
    {
      id: 'p9', name: 'Levi\'s Original Trucker Jacket', description: 'The original jean jacket since 1967.', features: ['100% Cotton non-stretch denim', 'Point collar', 'Button closures'], specifications: { 'Brand': 'Levi\'s', 'Fit': 'Standard', 'Wash': 'Light Blue' }, images: ['assets/images/img_ggcbnr6ml.jpg'], price: 3599, originalPrice: 4599, discount: 21, rating: 4.7, reviewCount: 195,
      reviews: [{ id: 'r9', userName: 'Karan', rating: 5, title: 'Timeless piece', comment: 'Quality is top notch.', date: '2024-11-15', helpful: 14 }],
      seller: { id: 'seller1', name: 'ShopVista Store' }, category: 'Fashion', subcategory: 'Men', brand: 'Levi\'s', stock: 40, tags: ['jacket', 'denim', 'levis']
    },
    {
      id: 'p10', name: 'Ninja Professional Blender 1000W', description: 'Professional power with a sleek design.', features: ['1000 watts of power', '72 oz Total Crushing Pitcher', 'Ice crushing technology'], specifications: { 'Brand': 'Ninja', 'Capacity': '2.1L', 'Material': 'BPA-free plastic' }, images: ['assets/images/img_wv3v7akcv.jpg'], price: 8999, originalPrice: 12999, discount: 30, rating: 4.6, reviewCount: 4210,
      reviews: [{ id: 'r10', userName: 'Pooja', rating: 5, title: 'Amazing blender', comment: 'Makes perfect smoothies.', date: '2025-02-05', helpful: 31 }],
      seller: { id: 'seller1', name: 'ShopVista Store' }, category: 'Home & Kitchen', subcategory: 'Appliances', brand: 'Ninja', stock: 75, tags: ['blender', 'kitchen', 'ninja']
    },
    {
      id: 'p11', name: 'Nespresso VertuoPlus Coffee Machine', description: 'Brews 4 different cup sizes at the touch of a button.', features: ['Centrifusion technology', 'Fast heat-up time', 'Includes Aeroccino milk frother'], specifications: { 'Brand': 'Nespresso', 'Water Tank': '1.2L', 'Power': '1300W' }, images: ['assets/images/img_tl7mb80dp.jpg'], price: 15499, originalPrice: 19999, discount: 22, rating: 4.7, reviewCount: 1185,
      reviews: [{ id: 'r11', userName: 'Raj', rating: 5, title: 'Café style coffee', comment: 'So easy to use.', date: '2024-12-25', helpful: 20 }],
      seller: { id: 'seller1', name: 'ShopVista Store' }, category: 'Home & Kitchen', subcategory: 'Appliances', brand: 'Nespresso', stock: 50, tags: ['coffee', 'nespresso', 'kitchen']
    },
    {
      id: 'p12', name: 'Tempur-Pedic Cloud Pillow', description: 'Extra-soft feel combined with adaptive support.', features: ['TEMPUR-Material™', 'Washable cover', 'Designed for back/stomach sleepers'], specifications: { 'Brand': 'Tempur-Pedic', 'Size': 'Standard', 'Firmness': 'Soft' }, images: ['assets/images/img_l9nxj1kr1.jpg'], price: 6999, originalPrice: 8999, discount: 22, rating: 4.4, reviewCount: 820,
      reviews: [{ id: 'r12', userName: 'Sneha', rating: 4, title: 'Very soft', comment: 'Great sleep, but a bit pricey.', date: '2025-01-10', helpful: 40 }],
      seller: { id: 'seller1', name: 'ShopVista Store' }, category: 'Home & Kitchen', subcategory: 'Bedding', brand: 'Tempur-Pedic', stock: 100, tags: ['pillow', 'bedding', 'tempur']
    },
    {
      id: 'p13', name: 'The Silent Patient by Alex Michaelides', description: 'The instant #1 New York Times bestselling thriller.', features: ['Paperback', '336 Pages', 'Psychological Thriller'], specifications: { 'Author': 'Alex Michaelides', 'Publisher': 'Celadon Books', 'Language': 'English' }, images: ['assets/images/img_8gpmp8ghy.jpg'], price: 349, originalPrice: 499, discount: 30, rating: 4.5, reviewCount: 2450,
      reviews: [{ id: 'r13', userName: 'Varun', rating: 5, title: 'Mind blowing ending', comment: 'Did not see that coming.', date: '2024-10-30', helpful: 55 }],
      seller: { id: 'seller1', name: 'ShopVista Store' }, category: 'Books', subcategory: 'Fiction', brand: 'Celadon', stock: 300, tags: ['book', 'thriller', 'mystery']
    },
    {
      id: 'p14', name: 'Liforme Original Yoga Mat', description: 'The ultimate grip for your yoga practice.', features: ['AlignForMe system', 'Eco-friendly PVC-free', 'Wider and longer'], specifications: { 'Brand': 'Liforme', 'Material': 'Natural Rubber', 'Dimensions': '72.8" x 26.8"' }, images: ['assets/images/img_bpygdpcg5.jpg'], price: 11999, originalPrice: 13999, discount: 14, rating: 4.8, reviewCount: 945,
      reviews: [{ id: 'r14', userName: 'Meera', rating: 5, title: 'Best mat ever', comment: 'Absolutely no slipping.', date: '2025-02-12', helpful: 16 }],
      seller: { id: 'seller1', name: 'ShopVista Store' }, category: 'Sports', subcategory: 'Fitness', brand: 'Liforme', stock: 80, tags: ['yoga', 'mat', 'fitness']
    },
    {
      id: 'p15', name: 'Adidas Al Rihla Pro Football', description: 'Official Match Ball of the FIFA World Cup Qatar 2022.', features: ['70% polyurethane', 'Speedshell PU skin', 'Seamless thermally bonded'], specifications: { 'Brand': 'Adidas', 'Size': '5', 'Weight': '430g' }, images: ['assets/images/img_ziskd46ch.jpg'], price: 10999, originalPrice: 12999, discount: 15, rating: 4.7, reviewCount: 188,
      reviews: [{ id: 'r15', userName: 'Rahul', rating: 5, title: 'Incredible flight', comment: 'True match quality.', date: '2024-11-05', helpful: 10 }],
      seller: { id: 'seller1', name: 'ShopVista Store' }, category: 'Sports', subcategory: 'Team Sports', brand: 'Adidas', stock: 120, tags: ['football', 'adidas', 'soccer']
    },
    {
      id: 'p16', name: 'MAC Retro Matte Lipstick - Ruby Woo', description: 'The iconic vivid blue-red matte lipstick.', features: ['Long-wearing, 8 hours', 'Non-feathering', 'Intense color payoff'], specifications: { 'Brand': 'MAC', 'Shade': 'Ruby Woo', 'Finish': 'Retro Matte' }, images: ['assets/images/img_g6p9bnzs2.jpg'], price: 1950, originalPrice: 1950, discount: 0, rating: 4.6, reviewCount: 5275,
      reviews: [{ id: 'r16', userName: 'Simran', rating: 5, title: 'The perfect red', comment: 'Suits every skin tone.', date: '2025-01-28', helpful: 22 }],
      seller: { id: 'seller1', name: 'ShopVista Store' }, category: 'Beauty', subcategory: 'Makeup', brand: 'MAC', stock: 250, tags: ['lipstick', 'mac', 'beauty']
    },
    {
      id: 'p17', name: 'Chanel Coco Mademoiselle EDP', description: 'Irresistibly sexy, irrepressibly spirited fragrance.', features: ['Notes of Orange & Rose', 'Long-lasting sillage', 'Elegant glass bottle'], specifications: { 'Brand': 'Chanel', 'Volume': '50ml', 'Type': 'Eau de Parfum' }, images: ['assets/images/img_3epmw1ulz.jpg'], price: 11500, originalPrice: 11500, discount: 0, rating: 4.9, reviewCount: 1190,
      reviews: [{ id: 'r17', userName: 'Anita', rating: 5, title: 'My signature scent', comment: 'Absolutely gorgeous fragrance.', date: '2024-12-10', helpful: 35 }],
      seller: { id: 'seller1', name: 'ShopVista Store' }, category: 'Beauty', subcategory: 'Fragrances', brand: 'Chanel', stock: 65, tags: ['perfume', 'chanel', 'beauty']
    },
    {
      id: 'p18', name: 'Hot Wheels 50-Car Pack', description: 'Awesome collection of 50 Hot Wheels vehicles.', features: ['1:64 scale vehicles', 'Realistic details', 'Great for collectors'], specifications: { 'Brand': 'Hot Wheels', 'Material': 'Diecast metal', 'Age': '3+' }, images: ['assets/images/img_ee7qasfwk.jpg'], price: 4999, originalPrice: 6999, discount: 28, rating: 4.8, reviewCount: 665,
      reviews: [{ id: 'r18', userName: 'Vikram', rating: 5, title: 'Kids love it', comment: 'Great variety of cars.', date: '2025-02-15', helpful: 8 }],
      seller: { id: 'seller1', name: 'ShopVista Store' }, category: 'Toys', subcategory: 'Vehicles', brand: 'Hot Wheels', stock: 90, tags: ['toy', 'cars', 'hotwheels']
    },
    {
      id: 'p19', name: 'Dabur 100% Pure Honey - 1kg', description: 'Sourced from the finest honey reserves in the Himalayas.', features: ['100% Pure', 'No Added Sugar', 'Builds immunity'], specifications: { 'Brand': 'Dabur', 'Weight': '1kg', 'Type': 'Raw Honey' }, images: ['assets/images/img_t45lno07q.jpg'], price: 395, originalPrice: 430, discount: 8, rating: 4.7, reviewCount: 4420,
      reviews: [{ id: 'r19', userName: 'Swati', rating: 5, title: 'Trustworthy brand', comment: 'Always keep this in my pantry.', date: '2024-11-28', helpful: 50 }],
      seller: { id: 'seller1', name: 'ShopVista Store' }, category: 'Groceries', subcategory: 'Pantry', brand: 'Dabur', stock: 180, tags: ['honey', 'grocery', 'dabur']
    }
  ];
  localStorage.setItem('shopvista_products', JSON.stringify(products));

  const addresses = [
    { id: 'a1', name: 'Customer', phone: '9876543210', line1: '123 Main Street', line2: 'Apt 4B', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', type: 'home', isDefault: true },
    { id: 'a2', name: 'Customer', phone: '9876543210', line1: '456 Tech Park', line2: 'Building C', city: 'Pune', state: 'Maharashtra', pincode: '411001', type: 'work', isDefault: false }
  ];
  localStorage.setItem('shopvista_addresses_customer1', JSON.stringify(addresses));

  const orders = [
    {
      id: 'ORD-20240115-001',
      userId: 'customer1',
      items: [{ productId: 'p1', name: 'Wireless Noise Cancelling Headphones', image: 'assets/images/img_f3v9fafn3.jpg', quantity: 1, price: 2999, sellerId: 'seller1' }],
      subtotal: 2999, discount: 3000, delivery: 0, total: 2999,
      status: 'delivered',
      date: '2024-01-15T10:30:00',
      address: addresses[0],
      paymentMethod: 'card'
    },
    {
      id: 'ORD-20240210-002',
      userId: 'customer1',
      items: [{ productId: 'p6', name: 'Classic Cotton T-Shirt', image: 'assets/images/img_nrq64yyf1.jpg', quantity: 2, price: 499, sellerId: 'seller1' }],
      subtotal: 998, discount: 1000, delivery: 0, total: 998,
      status: 'shipped',
      date: '2024-02-10T14:45:00',
      address: addresses[1],
      paymentMethod: 'upi'
    }
  ];
  localStorage.setItem('shopvista_orders', JSON.stringify(orders));
}
