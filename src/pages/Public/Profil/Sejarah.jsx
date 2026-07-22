import React from 'react'
import Template from '../../../layouts/Template.jsx'

export default function Sejarah() {
  const [activeHistoryItem, setActiveHistoryItem] = React.useState('profile')
  const tasks = [
    'Tata Hutan dan Penyusunan Rencana Pengelolaan',
    'Pemanfaatan Hutan',
    'Rehabilitasi dan Reklamasi Hutan',
    'Perlindungan Hutan',
    'Konservasi Sumber Daya Alam',
    'Pengendalian Kebakaran Hutan dan Lahan',
  ]

  return (
    <Template title="Sejarah" active="profil">
      <section id="sejarah" className="history-section">
        <div className="container">
          <div className="text-center mb-5 history-heading">
            <h1 className="fw-bold heading-green animate-title">
              Sejarah Unit Pelaksanaan Teknis Kesatuan Pengelolaan Hutan <br />Tasik Besar Serkap
            </h1>
          </div>

          <div className="row g-4 align-items-stretch">
            <div className="col-lg-6">
              <article
                className={`history-panel history-panel-main history-clickable ${activeHistoryItem === 'profile' ? 'is-active' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => setActiveHistoryItem('profile')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setActiveHistoryItem('profile')
                }}
              >
                <span className="history-kicker">Profil Singkat</span>
                <h2>Sejarah</h2>
                <p>
                  Unit Pelaksana Teknis Kesatuan Pengelolaan Hutan (UPT KPH) Tasik Besar Serkap adalah unit
                  pelaksana teknis di bawah Dinas Lingkungan Hidup dan Kehutanan Provinsi Riau yang bertugas
                  melaksanakan kegiatan pengelolaan hutan di wilayah kerjanya. KPH Tasik Besar Serkap memiliki
                  wilayah kerja di Kabupaten Siak dan Pelalawan, Riau, dengan luas mencapai ratusan ribu hektar.
                </p>
                <p>
                  Pembentukan KPH Tasik Besar Serkap tidak lepas dari kebijakan pemerintah pusat dan daerah
                  dalam rangka pengelolaan hutan yang lebih efektif dan efisien, serta mendukung pembangunan
                  berkelanjutan. Beberapa poin penting terkait sejarah pembentukannya.
                </p>
                <p>
                  Dengan dukungan dari berbagai pihak, termasuk pemerintah, masyarakat, dan pelaku usaha,
                  diharapkan KPH Tasik Besar Serkap dapat melaksanakan tugas dan fungsinya secara optimal,
                  sehingga pengelolaan hutan di wilayah kerjanya dapat berjalan berkelanjutan dan memberikan
                  manfaat bagi semua pihak.
                </p>
              </article>
            </div>

            <div className="col-lg-6 d-flex flex-column gap-3">
              <div className="history-feature-grid">
                <article
                  className={`history-mini-panel history-clickable ${activeHistoryItem === 'rule' ? 'is-active' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveHistoryItem('rule')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setActiveHistoryItem('rule')
                  }}
                >
                  <span className="history-icon">01</span>
                  <h2>Peraturan Gubernur Riau</h2>
                  <p>
                    KPH Tasik Besar Serkap dibentuk berdasarkan Peraturan Gubernur Riau yang mengatur tentang
                    pembentukan dan pengelolaan KPH di wilayah Provinsi Riau.
                  </p>
                </article>

                <article
                  className={`history-mini-panel history-clickable ${activeHistoryItem === 'area' ? 'is-active' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveHistoryItem('area')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setActiveHistoryItem('area')
                  }}
                >
                  <span className="history-icon">02</span>
                  <h2>Wilayah Kerja yang Luas</h2>
                  <p>
                    KPH Tasik Besar Serkap memiliki wilayah kerja yang cukup luas, mencakup Kabupaten Siak dan
                    Pelalawan, yang merupakan kawasan hutan dengan berbagai potensi dan fungsi.
                  </p>
                </article>
              </div>

              <article className="history-panel">
                <h2>Tugas dan Fungsi KPH Tasik Besar Serkap</h2>
                <ol className="history-task-list">
                  {tasks.map((task, index) => {
                    const key = `task-${index}`
                    return (
                      <li
                        key={task}
                        className={`history-clickable ${activeHistoryItem === key ? 'is-active' : ''}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => setActiveHistoryItem(key)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') setActiveHistoryItem(key)
                        }}
                      >
                        {task}
                      </li>
                    )
                  })}
                </ol>
              </article>
            </div>
          </div>
        </div>
      </section>
    </Template>
  )
}
