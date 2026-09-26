// mock/auth.js
// 登录绑定的 Mock 数据处理

// Mock 测试账号（开发阶段使用，真实接入后删除）
const MOCK_ACCOUNTS = {
  P20240001: {
    patientId: 'P20240001',
    patientName: '李**',
    bindPhone: '13800138000',
  },
  P20240002: {
    patientId: 'P-2024-0002',
    patientName: '白艳丽',
    bindPhone: '13900139000',
  },
}

const MOCK_SMS_CODE = '123456'

const mockAuth = {
  /**
   * 发送验证码
   * Mock：任意合法手机号均返回成功
   */
  sendSms(phone) {
    const isValid = /^1[3-9]\d{9}$/.test(phone)
    if (!isValid) {
      return { success: false, message: '手机号格式不正确' }
    }
    return { success: true, message: '验证码已发送，请注意查收' }
  },

  /**
   * 验证码校验 + 患者ID绑定
   * Mock 规则：
   *   - 验证码必须为 123456
   *   - 患者ID必须为 P20240001 或 P20240002
   */
  bind(phone, code, patientId) {
    if (code !== MOCK_SMS_CODE) {
      return { success: false, message: '验证码错误，请重新获取' }
    }

    const account = MOCK_ACCOUNTS[patientId]
    if (!account) {
      return {
        success: false,
        message: '未找到对应患者，请确认患者编号是否正确',
      }
    }

    // 脱敏手机号（用于展示，保留前3位和后4位）
    const maskedPhone = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')

    return {
      success: true,
      data: {
        patientId: account.patientId,
        patientName: account.patientName,
        phone: maskedPhone,
        token: `mock_token_${account.patientId}_${Date.now()}`,
        bindTime: new Date().toISOString(),
      },
    }
  },
}

module.exports = { mockAuth }
