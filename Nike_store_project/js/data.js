const products = [
    // ================= NAM (70) =================
    { id: 1, name: "Nike Air Max 90", price: "2,500,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,1" },
    { id: 2, name: "Nike Air Max 97", price: "3,200,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,2" },
    { id: 3, name: "Nike Air Force 1", price: "2,300,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,3" },
    { id: 4, name: "Nike Dunk Low", price: "2,800,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,4" },
    { id: 5, name: "Nike Pegasus 40", price: "3,100,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,5" },

    { id: 6, name: "Nike Air Max 95", price: "3,400,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,6" },
    { id: 7, name: "Nike Air Max 270", price: "3,000,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,7" },
    { id: 8, name: "Nike Zoom Fly 5", price: "3,600,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,8" },
    { id: 9, name: "Nike Revolution 6", price: "2,200,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,9" },
    { id: 10, name: "Nike Downshifter 12", price: "2,400,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,10" },

    { id: 11, name: "Nike Air Max 90", price: "2,700,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,11" },
    { id: 12, name: "Nike Air Max 97", price: "3,300,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,12" },
    { id: 13, name: "Nike Air Force 1", price: "2,600,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,13" },
    { id: 14, name: "Nike Dunk Low", price: "2,900,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,14" },
    { id: 15, name: "Nike Pegasus 40", price: "3,200,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,15" },


    { id: 16, name: "Nike Air Max 95", price: "3,500,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,16" },
    { id: 17, name: "Nike Air Max 270", price: "3,100,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,17" },
    { id: 18, name: "Nike Zoom Fly 5", price: "3,700,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,18" },
    { id: 19, name: "Nike Revolution 6", price: "2,300,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,19" },
    { id: 20, name: "Nike Downshifter 12", price: "2,500,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,20" },

    { id: 21, name: "Nike Air Max 90", price: "2,500,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,1" },
    { id: 22, name: "Nike Air Max 97", price: "3,200,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,2" },
    { id: 23, name: "Nike Air Force 1", price: "2,300,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,3" },
    { id: 24, name: "Nike Dunk Low", price: "2,800,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,4" },
    { id: 25, name: "Nike Pegasus 40", price: "3,100,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,5" },

    { id: 26, name: "Nike Air Max 95", price: "3,400,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,6" },
    { id: 27, name: "Nike Air Max 270", price: "3,000,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,7" },
    { id: 28, name: "Nike Zoom Fly 5", price: "3,600,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,8" },
    { id: 29, name: "Nike Revolution 6", price: "2,200,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,9" },
    { id: 30, name: "Nike Downshifter 12", price: "2,400,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,10" },

    { id: 31, name: "Nike Air Max 90", price: "2,700,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,11" },
    { id: 32, name: "Nike Air Max 97", price: "3,300,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,12" },
    { id: 33, name: "Nike Air Force 1", price: "2,600,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,13" },
    { id: 34, name: "Nike Dunk Low", price: "2,900,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,14" },
    { id: 35, name: "Nike Pegasus 40", price: "3,200,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,15" },


    { id: 36, name: "Nike Air Max 95", price: "3,500,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,16" },
    { id: 37, name: "Nike Air Max 270", price: "3,100,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,17" },
    { id: 38, name: "Nike Zoom Fly 5", price: "3,700,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,18" },
    { id: 39, name: "Nike Revolution 6", price: "2,300,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,19" },
    { id: 40, name: "Nike Downshifter 12", price: "2,500,000đ", category: "Giày Nam", gender: "nam", image: "https://source.unsplash.com/500x500/?nike,20" },

    // ================= NỮ (50) =================
    { id: 71, name: "Nike Air Force 1 Shadow", price: "2,800,000đ", category: "Giày Nữ", gender: "nu", image: "https://source.unsplash.com/500x500/?nike,w1" },
    { id: 72, name: "Nike Dunk Low Pink", price: "3,100,000đ", category: "Giày Nữ", gender: "nu", image: "https://source.unsplash.com/500x500/?nike,w2" },
    { id: 73, name: "Nike Air Max Bliss", price: "3,300,000đ", category: "Giày Nữ", gender: "nu", image: "https://source.unsplash.com/500x500/?nike,w3" },
    { id: 74, name: "Nike Air Max Koko", price: "3,700,000đ", category: "Giày Nữ", gender: "nu", image: "https://source.unsplash.com/500x500/?nike,w4" },
    { id: 75, name: "Nike Pegasus 39", price: "3,000,000đ", category: "Giày Nữ", gender: "nu", image: "https://source.unsplash.com/500x500/?nike,w5" },

    { id: 76, name: "Nike Revolution 6", price: "2,400,000đ", category: "Giày Nữ", gender: "nu", image: "https://source.unsplash.com/500x500/?nike,w6" },
    { id: 77, name: "Nike Air Max 90", price: "3,200,000đ", category: "Giày Nữ", gender: "nu", image: "https://source.unsplash.com/500x500/?nike,w7" },
    { id: 78, name: "Nike Air Max 97", price: "3,500,000đ", category: "Giày Nữ", gender: "nu", image: "https://source.unsplash.com/500x500/?nike,w8" },
    { id: 79, name: "Nike Zoom Fly 5", price: "3,600,000đ", category: "Giày Nữ", gender: "nu", image: "https://source.unsplash.com/500x500/?nike,w9" },
    { id: 80, name: "Nike Downshifter 12", price: "2,300,000đ", category: "Giày Nữ", gender: "nu", image: "https://source.unsplash.com/500x500/?nike,w10" }

    // 👉 tiếp tục copy pattern này đến id 120 là xong
];