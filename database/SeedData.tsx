// seedData.ts

export interface SeedDeck {
    id: number;
    title: string;
    description?: string;
    imageUrl?: string;
}

export interface SeedCard {
    front_text: string;
    back_text: string;
    deck_id: number;
}

export const seedDecks: SeedDeck[] = [
    {
        id: 1,
        title: 'English Vocabulary',
        description: 'Core high-frequency English words (NGSL)',
        imageUrl: 'https://blogassets.leverageedu.com/media/uploads/2022/11/07103709/English-Blog-Covers-26.jpg'
        // Ảnh sách mở trang từ Unsplash :contentReference[oaicite:2]{index=2}
    },
    {
        id: 2,
        title: 'Phrasal Verbs',
        description: 'Common separable & inseparable phrasal verbs',
        imageUrl: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7843?auto=format&fit=crop&w=800&q=80'
        // Ảnh giấy note với từ vựng từ Unsplash :contentReference[oaicite:3]{index=3}
    },
    {
        id: 3,
        title: 'TOEIC Vocabulary',
        description: '600 essential words for the TOEIC test',
        imageUrl: 'https://images.unsplash.com/photo-1553374054-0fb1f5592be3?auto=format&fit=crop&w=800&q=80'
        // Ảnh bàn làm việc văn phòng từ Unsplash :contentReference[oaicite:4]{index=4}
    },
    {
        id: 4,
        title: 'Business English',
        description: 'Key terms used in corporate and finance contexts',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80'
        // Ảnh cuộc họp kinh doanh từ Unsplash :contentReference[oaicite:5]{index=5}
    }
];

export const seedCards: SeedCard[] = [
    // English Vocabulary
    { front_text: 'time', back_text: 'thời gian', deck_id: 1 },
    { front_text: 'people', back_text: 'người', deck_id: 1 },
    { front_text: 'year', back_text: 'năm', deck_id: 1 },
    { front_text: 'work', back_text: 'công việc', deck_id: 1 },
    { front_text: 'way', back_text: 'cách (thức)', deck_id: 1 },

    // Phrasal Verbs
    { front_text: 'fill in', back_text: 'điền vào (mẫu đơn)', deck_id: 2 },
    { front_text: 'bring up', back_text: 'nêu lên (vấn đề)', deck_id: 2 },
    { front_text: 'pick up', back_text: 'đón; nhặt lên', deck_id: 2 },
    { front_text: 'turn down', back_text: 'từ chối; vặn nhỏ', deck_id: 2 },
    { front_text: 'break down', back_text: 'hư hỏng; phân tích', deck_id: 2 },

    // TOEIC Vocabulary
    { front_text: 'contract', back_text: 'hợp đồng', deck_id: 3 },
    { front_text: 'assurance', back_text: 'sự cam đoan; bảo đảm', deck_id: 3 },
    { front_text: 'determine', back_text: 'xác định', deck_id: 3 },
    { front_text: 'engage', back_text: 'thu hút; tham gia', deck_id: 3 },
    { front_text: 'establish', back_text: 'thành lập; thiết lập', deck_id: 3 },

    // Business English
    { front_text: 'stakeholder', back_text: 'các bên liên quan', deck_id: 4 },
    { front_text: 'revenue', back_text: 'doanh thu', deck_id: 4 },
    { front_text: 'budget', back_text: 'ngân sách', deck_id: 4 },
    { front_text: 'merger', back_text: 'sáp nhập', deck_id: 4 },
    { front_text: 'acquisition', back_text: 'mua lại; thâu tóm', deck_id: 4 }
];
