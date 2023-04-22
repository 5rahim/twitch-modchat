import React, { memo } from 'react'

export const SettingLine: React.FC<React.ReactNode> = memo(({ children }) => (
   <div style={{ marginBottom: '1rem' }}>{children}</div>
))
