import { useState, useEffect } from 'react'
import { Save, MapPin, Map, Users, Info, ToggleLeft, ToggleRight, CheckCircle, XCircle, Loader } from 'lucide-react'
import { settingsAPI } from '../../services/api'

// Default values untuk semua setting lokasi
const DEFAULT_SETTINGS = {
  sekolah_latitude: '',
  sekolah_longitude: '',
  lokasi_laki_latitude: '',
  lokasi_laki_longitude: '',
  lokasi_laki_enabled: '1',
  lokasi_perempuan_latitude: '',
  lokasi_perempuan_longitude: '',
  lokasi_perempuan_enabled: '1',
  radius_gps: '100'
}

function LokasiGeofence({ user }) {
  const isReadOnly = user?.role === 'kepala_sekolah'
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState(null) // track which group is saving
  const [notification, setNotification] = useState({ show: false, message: '', type: '' })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const response = await settingsAPI.getAll()
      // Merge dengan default agar tidak ada undefined
      setSettings(prev => ({ ...DEFAULT_SETTINGS, ...prev, ...response.data }))
    } catch (error) {
      console.error('Failed to load settings:', error)
      showNotification('Gagal memuat pengaturan: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3500)
  }

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  // Simpan pasangan koordinat sekaligus (lat + lng) menggunakan Promise.all
  const handleSavePair = async (groupKey, keyLat, keyLng, label) => {
    if (savingKey) return // cegah double-klik
    try {
      setSavingKey(groupKey)
      await Promise.all([
        settingsAPI.update(keyLat, settings[keyLat]),
        settingsAPI.update(keyLng, settings[keyLng]),
      ])
      showNotification(`${label} berhasil disimpan!`, 'success')
    } catch (error) {
      console.error('Save error:', error)
      showNotification('Gagal menyimpan ' + label + ': ' + error.message, 'error')
    } finally {
      setSavingKey(null)
    }
  }

  // Toggle switch on/off
  const toggleFeature = async (key, label) => {
    if (savingKey) return
    const newValue = settings[key] === '1' ? '0' : '1'
    
    // Optimistic update
    setSettings(prev => ({ ...prev, [key]: newValue }))
    
    try {
      setSavingKey(key)
      await settingsAPI.update(key, newValue)
      showNotification(
        `${label} ${newValue === '1' ? 'diaktifkan' : 'dinonaktifkan'}!`,
        'success'
      )
    } catch (error) {
      // Rollback jika gagal
      setSettings(prev => ({ ...prev, [key]: newValue === '1' ? '0' : '1' }))
      showNotification('Gagal memperbarui status: ' + error.message, 'error')
    } finally {
      setSavingKey(null)
    }
  }

  const isSaving = (key) => savingKey === key

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 text-sm">Memuat pengaturan lokasi...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Lokasi &amp; Geofence</h1>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
          <Info className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-700">Radius Aktif: <strong>{settings.radius_gps}m</strong></span>
        </div>
      </div>

      {/* Banner Read-Only untuk Kepala Sekolah */}
      {isReadOnly && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">👁️</span>
          <div>
            <p className="font-semibold text-amber-800 text-sm">Mode Lihat Saja</p>
            <p className="text-xs text-amber-700">Akun Kepala Sekolah hanya dapat melihat koordinat lokasi, tidak dapat mengubah atau menyimpan data.</p>
          </div>
        </div>
      )}

      {/* Grid Lokasi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LOKASI SEKOLAH (PUSAT) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <h3 className="font-bold text-lg">Lokasi Sekolah (Pusat)</h3>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">FALLBACK UTAMA</span>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600">Titik koordinat utama sekolah. Digunakan jika Pos Laki-laki/Perempuan dinonaktifkan.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={settings.sekolah_latitude}
                  onChange={(e) => handleChange('sekolah_latitude', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="-7.123456"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={settings.sekolah_longitude}
                  onChange={(e) => handleChange('sekolah_longitude', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="112.123456"
                  disabled={isReadOnly}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSavePair('sekolah', 'sekolah_latitude', 'sekolah_longitude', 'Lokasi Sekolah')}
                disabled={isSaving('sekolah') || isReadOnly}
                className="flex-1 bg-gray-800 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving('sekolah') ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving('sekolah') ? 'Menyimpan...' : 'Simpan Lokasi Pusat'}
              </button>
              <a
                href={`https://www.google.com/maps?q=${settings.sekolah_latitude},${settings.sekolah_longitude}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                title="Buka di Google Maps"
              >
                <Map className="w-5 h-5 text-gray-600" />
              </a>
            </div>
          </div>
        </div>

        {/* LOKASI GURU LAKI-LAKI */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-blue-900 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <h3 className="font-bold text-lg">Pos Guru Laki-laki</h3>
            </div>
            {/* Toggle Pos Laki-laki */}
            <button
              onClick={() => toggleFeature('lokasi_laki_enabled', 'Pos Laki-laki')}
              disabled={isSaving('lokasi_laki_enabled') || isReadOnly}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving('lokasi_laki_enabled') ? (
                <Loader className="w-7 h-7 animate-spin" />
              ) : settings.lokasi_laki_enabled === '1' ? (
                <ToggleRight className="w-7 h-7 text-green-300" />
              ) : (
                <ToggleLeft className="w-7 h-7 opacity-50" />
              )}
              <span className="text-[10px] font-black min-w-[24px]">
                {settings.lokasi_laki_enabled === '1' ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold ${
              settings.lokasi_laki_enabled === '1' 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-gray-50 text-gray-500 border-gray-200'
            }`}>
              {settings.lokasi_laki_enabled === '1' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {settings.lokasi_laki_enabled === '1' ? 'AKTIF: Guru Laki-laki wajib absen di titik ini' : 'NONAKTIF: Mengikuti Lokasi Pusat'}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={settings.lokasi_laki_latitude}
                  onChange={(e) => handleChange('lokasi_laki_latitude', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="-7.123456"
                  disabled={isReadOnly || settings.lokasi_laki_enabled === '0'}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={settings.lokasi_laki_longitude}
                  onChange={(e) => handleChange('lokasi_laki_longitude', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="112.123456"
                  disabled={isReadOnly || settings.lokasi_laki_enabled === '0'}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSavePair('laki', 'lokasi_laki_latitude', 'lokasi_laki_longitude', 'Pos Putra')}
                disabled={isSaving('laki') || isReadOnly || settings.lokasi_laki_enabled === '0'}
                className="flex-1 bg-blue-900 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving('laki') ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving('laki') ? 'Menyimpan...' : 'Simpan Pos Putra'}
              </button>
              <a
                href={`https://www.google.com/maps?q=${settings.lokasi_laki_latitude},${settings.lokasi_laki_longitude}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                title="Buka di Google Maps"
              >
                <Map className="w-5 h-5 text-gray-600" />
              </a>
            </div>
          </div>
        </div>

        {/* LOKASI GURU PEREMPUAN */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-pink-600 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <h3 className="font-bold text-lg">Pos Guru Perempuan</h3>
            </div>
            {/* Toggle Pos Perempuan */}
            <button
              onClick={() => toggleFeature('lokasi_perempuan_enabled', 'Pos Perempuan')}
              disabled={isSaving('lokasi_perempuan_enabled') || isReadOnly}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving('lokasi_perempuan_enabled') ? (
                <Loader className="w-7 h-7 animate-spin" />
              ) : settings.lokasi_perempuan_enabled === '1' ? (
                <ToggleRight className="w-7 h-7 text-pink-200" />
              ) : (
                <ToggleLeft className="w-7 h-7 opacity-50" />
              )}
              <span className="text-[10px] font-black min-w-[24px]">
                {settings.lokasi_perempuan_enabled === '1' ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold ${
              settings.lokasi_perempuan_enabled === '1' 
                ? 'bg-pink-50 text-pink-700 border-pink-200' 
                : 'bg-gray-50 text-gray-500 border-gray-200'
            }`}>
              {settings.lokasi_perempuan_enabled === '1' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {settings.lokasi_perempuan_enabled === '1' ? 'AKTIF: Guru Perempuan wajib absen di titik ini' : 'NONAKTIF: Mengikuti Lokasi Pusat'}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={settings.lokasi_perempuan_latitude}
                  onChange={(e) => handleChange('lokasi_perempuan_latitude', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="-7.123456"
                  disabled={isReadOnly || settings.lokasi_perempuan_enabled === '0'}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={settings.lokasi_perempuan_longitude}
                  onChange={(e) => handleChange('lokasi_perempuan_longitude', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="112.123456"
                  disabled={isReadOnly || settings.lokasi_perempuan_enabled === '0'}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSavePair('perempuan', 'lokasi_perempuan_latitude', 'lokasi_perempuan_longitude', 'Pos Putri')}
                disabled={isSaving('perempuan') || isReadOnly || settings.lokasi_perempuan_enabled === '0'}
                className="flex-1 bg-pink-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-pink-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving('perempuan') ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving('perempuan') ? 'Menyimpan...' : 'Simpan Pos Putri'}
              </button>
              <a
                href={`https://www.google.com/maps?q=${settings.lokasi_perempuan_latitude},${settings.lokasi_perempuan_longitude}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                title="Buka di Google Maps"
              >
                <Map className="w-5 h-5 text-gray-600" />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Panduan */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
        <h4 className="font-bold text-blue-800 mb-3 text-lg flex items-center gap-2">
          <Info className="w-5 h-5" /> Panduan Penggunaan Geofence
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-700">
          <div className="space-y-3">
            <p><strong>1. Pos Khusus:</strong> Gunakan saklar <strong>ON/OFF</strong> di Pos Laki-laki atau Perempuan jika lokasi presensi mereka terpisah dari gedung utama.</p>
            <p><strong>2. Mode Fallback:</strong> Jika saklar disetel <strong>OFF</strong>, maka guru tersebut akan divalidasi menggunakan koordinat <strong>Lokasi Sekolah (Pusat)</strong>.</p>
          </div>
          <div className="space-y-3">
            <p><strong>3. Koordinat:</strong> Ambil koordinat dari Google Maps (Klik kanan di peta &gt; pilih angka koordinat).</p>
            <p><strong>4. Radius:</strong> Pastikan guru berada dalam jarak radius aktif ({settings.radius_gps}m) agar presensi berhasil.</p>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 transition-all ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white font-bold`}>
          {notification.type === 'success'
            ? <CheckCircle className="w-5 h-5 flex-shrink-0" />
            : <XCircle className="w-5 h-5 flex-shrink-0" />}
          {notification.message}
        </div>
      )}
    </div>
  )
}

export default LokasiGeofence
