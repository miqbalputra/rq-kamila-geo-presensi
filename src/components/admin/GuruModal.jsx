import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

function GuruModal({ guru, onClose, onSave }) {
  const [formData, setFormData] = useState({
    idGuru: '',
    nama: '',
    tanggalLahir: '',
    jenisKelamin: 'Laki-laki',
    tipeGuru: 'full_time',
    alamat: '',
    noHP: '',
    jabatan: [''],
    tanggalBertugas: '',
    username: '',
    password: '',
    role: 'guru',
    activeDays: '1,2,3,4,5',
    activeDays2: '',
    workStartTime: '07:30',
    workEndTime: '15:00',
    workStartTime2: '',
    workEndTime2: ''
  })

  // Auto-fill username dan password jika tanggal lahir diisi (untuk guru baru)
  useEffect(() => {
    if (!guru && formData.tanggalLahir) {
      const date = new Date(formData.tanggalLahir);
      if (!isNaN(date.getTime())) {
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        const formattedDate = `${d}${m}${y}`;
        setFormData(prev => ({
          ...prev,
          username: formattedDate,
          password: formattedDate
        }));
      }
    }
  }, [formData.tanggalLahir, guru]);

  useEffect(() => {
    if (guru) {
      // Pastikan jabatan adalah array
      const jabatanArray = Array.isArray(guru.jabatan) ? guru.jabatan : [guru.jabatan]
      // Pastikan data schedule ada, jika tidak gunakan default
      setFormData({ 
        ...guru, 
        jabatan: jabatanArray,
        tipeGuru: guru.tipeGuru || 'full_time',
        activeDays: guru.activeDays || '1,2,3,4,5',
        activeDays2: guru.activeDays2 || '',
        workStartTime: guru.workStartTime ? guru.workStartTime.substring(0, 5) : '07:30',
        workEndTime: guru.workEndTime ? guru.workEndTime.substring(0, 5) : '15:00',
        workStartTime2: guru.workStartTime2 ? guru.workStartTime2.substring(0, 5) : '',
        workEndTime2: guru.workEndTime2 ? guru.workEndTime2.substring(0, 5) : ''
      })
    }
  }, [guru])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Filter jabatan yang kosong
    const cleanedData = {
      ...formData,
      jabatan: formData.jabatan.filter(j => j.trim() !== '')
    }
    onSave(cleanedData)
  }

  const addJabatan = () => {
    setFormData(prev => ({ ...prev, jabatan: [...prev.jabatan, ''] }))
  }

  const removeJabatan = (index) => {
    setFormData(prev => {
      const newJabatan = prev.jabatan.filter((_, i) => i !== index)
      return { ...prev, jabatan: newJabatan.length > 0 ? newJabatan : [''] }
    })
  }

  const toggleDay = (day) => {
    setFormData(prev => {
      const days = prev.activeDays.split(',').filter(d => d !== '')
      const index = days.indexOf(day.toString())
      if (index === -1) {
        days.push(day.toString())
      } else {
        days.splice(index, 1)
      }
      return { ...prev, activeDays: days.sort().join(',') }
    })
  }

  const toggleDay2 = (day) => {
    setFormData(prev => {
      const days = prev.activeDays2.split(',').filter(d => d !== '')
      const index = days.indexOf(day.toString())
      if (index === -1) {
        days.push(day.toString())
      } else {
        days.splice(index, 1)
      }
      return { ...prev, activeDays2: days.sort().join(',') }
    })
  }

  const daysLabels = {
    '1': 'Sen', '2': 'Sel', '3': 'Rab', '4': 'Kam', '5': 'Jum', '6': 'Sab', '7': 'Min'
  }

  const updateJabatan = (index, value) => {
    setFormData(prev => {
      const newJabatan = [...prev.jabatan]
      newJabatan[index] = value
      return { ...prev, jabatan: newJabatan }
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {guru ? 'Edit Guru' : 'Tambah Guru Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Guru <span className="text-xs text-gray-500">(Nomor Induk Guru)</span>
            </label>
            <input
              type="text"
              name="idGuru"
              value={formData.idGuru}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: G2020001"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
            <input
              type="date"
              name="tanggalLahir"
              value={formData.tanggalLahir}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
            <select
              name="jenisKelamin"
              value={formData.jenisKelamin}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Guru</label>
            <select
              name="tipeGuru"
              value={formData.tipeGuru}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="full_time">Full Time (Hadir setiap hari kerja)</option>
              <option value="partime">Partime (Scan = Hadir, tanpa status terlambat)</option>
            </select>
            {formData.tipeGuru === 'partime' && (
              <p className="mt-1 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                ⚡ Guru partime hanya perlu scan 1x. Langsung tercatat <strong>Hadir</strong> tanpa cek jam.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
            <textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nomor HP</label>
            <input
              type="tel"
              name="noHP"
              value={formData.noHP}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="08123456789"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Jabatan</label>
              <button
                type="button"
                onClick={addJabatan}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                Tambah Jabatan
              </button>
            </div>
            <div className="space-y-2">
              {formData.jabatan.map((jab, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={jab}
                    onChange={(e) => updateJabatan(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={`Jabatan ${index + 1}`}
                    required={index === 0}
                  />
                  {formData.jabatan.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeJabatan(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-blue-800 flex items-center gap-2">
              📅 Jadwal Kerja Guru
            </h3>
            
            <div>
              <label className="block text-xs font-semibold text-blue-700 mb-2">Hari Aktif Berangkat</label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      formData.activeDays.split(',').includes(day.toString())
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-blue-600 border border-blue-200'
                    }`}
                  >
                    {daysLabels[day]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-blue-700 mb-1">Jam Masuk (Shift 1)</label>
                <input
                  type="time"
                  name="workStartTime"
                  value={formData.workStartTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-700 mb-1">Jam Pulang (Shift 1)</label>
                <input
                  type="time"
                  name="workEndTime"
                  value={formData.workEndTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
            </div>

            <div className="pt-2 border-t border-blue-100">
              <label className="block text-xs font-bold text-blue-800 mb-2 uppercase tracking-tight">Shift ke-2 (Opsional / Split Shift)</label>
              
              <div className="mb-3">
                <label className="block text-xs font-semibold text-blue-600 mb-2">Hari Aktif Shift 2</label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay2(day)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                        formData.activeDays2.split(',').includes(day.toString())
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-indigo-600 border border-indigo-200'
                      }`}
                    >
                      {daysLabels[day]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-blue-600 mb-1">Masuk 2</label>
                  <input
                    type="time"
                    name="workStartTime2"
                    value={formData.workStartTime2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-600 mb-1">Pulang 2</label>
                  <input
                    type="time"
                    name="workEndTime2"
                    value={formData.workEndTime2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  />
                </div>
              </div>
              <p className="mt-2 text-[10px] text-blue-500 italic">Isi jika guru mengajar dua kali (misal: Sesi Malam)</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Bertugas</label>
            <input
              type="date"
              name="tanggalBertugas"
              value={formData.tanggalBertugas}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username {guru && <span className="text-xs text-gray-500">(ID Login)</span>}
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password {guru && <span className="text-xs text-gray-500">(Kosongkan jika tidak ingin mengubah)</span>}
            </label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder={guru ? "Kosongkan jika tidak ingin mengubah" : "Otomatis dari Tgl Lahir"}
              required={!guru}
            />
          </div>

          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white border-t border-gray-100 pt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 bg-white"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GuruModal
