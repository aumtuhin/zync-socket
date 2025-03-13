import os from 'os'

/**
 * Get the local network IP address.
 * This is useful for accessing the server from other devices in the same network.
 */
export const getLocalIp = (): string => {
  const interfaces = os.networkInterfaces()
  for (const interfaceName in interfaces) {
    for (const iface of interfaces[interfaceName] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
  return 'localhost'
}
