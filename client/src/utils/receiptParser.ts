import Tesseract from 'tesseract.js';

export interface ParsedReceipt {
    amount: number;
    recipientName: string;
    text: string;
}

export const parseReceiptImage = async (file: File | Blob): Promise<ParsedReceipt> => {
    try {
        const result = await Tesseract.recognize(file, 'tha+eng');
        const text = result.data.text;

        // Extract amount (e.g., 100.00, 1,200.50)
        const amountMatch = text.match(/[\d,]+\.\d{2}/);
        let amount = 0;
        if (amountMatch) {
            amount = parseFloat(amountMatch[0].replace(/,/g, ''));
        }

        // Extract recipient name (Thai name pattern - คนที่โอนไปให้)
        // Look for patterns like "ไปยัง", "โอนไป", "ผู้รับ", or Thai name patterns
        let recipientName = '';

        // Pattern 1: After "ไปยัง" or "โอนไป" or "ผู้รับ"
        const recipientPatterns = [
            /(?:ไปยัง|โอนไป|ผู้รับ|to|To|TO)[:\s]*([ก-๙a-zA-Z\s]+)/,
            /(?:นาย|นาง|นางสาว|Mr\.|Mrs\.|Ms\.)[ก-๙a-zA-Z\s]+/,
        ];

        for (const pattern of recipientPatterns) {
            const match = text.match(pattern);
            if (match) {
                recipientName = match[1] || match[0];
                recipientName = recipientName.trim().substring(0, 50); // Limit length
                break;
            }
        }

        // If no recipient found, try to get any Thai name-like pattern
        if (!recipientName) {
            const thaiNameMatch = text.match(/[ก-๙]{2,}\s+[ก-๙]{2,}/);
            if (thaiNameMatch) {
                recipientName = thaiNameMatch[0].trim();
            }
        }

        return { amount, recipientName, text };
    } catch (error) {
        console.error('OCR Error:', error);
        throw new Error('Failed to parse receipt');
    }
};
