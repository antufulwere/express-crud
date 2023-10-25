import QrCode from 'qrcode'

export class TwoFAHandler {
    public static async get2FABase64QR(name: string, secret: string) {
        const link = `otpauth://totp/${name}?secret=${secret}&issuer=Systango`
        return await QrCode.toDataURL(link)
    }
}
