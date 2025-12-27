import React, { useState, useCallback, useRef } from 'react';
import { read, utils } from 'xlsx';
import toast, { Toaster } from 'react-hot-toast';
import { Upload, Send, SendHorizonal, X, Image as ImageIcon, Volume2, RefreshCw, FileDown, FileText, FileSpreadsheet } from 'lucide-react';
import type { ExcelRow, MessageWithImage } from './types';
import { sendWhatsAppMessage, sendWhatsAppMessageBulk, downloadMessageReport, MessageResult } from './services/whatsapp';

function App() {
  const [data, setData] = useState<ExcelRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<MessageWithImage | null>(null);
  const [massImageFile, setMassImageFile] = useState<File | null>(null);
  const [sendAudioMass, setSendAudioMass] = useState(false);
  const [messageResults, setMessageResults] = useState<MessageResult[]>([]);
  const [showReportOptions, setShowReportOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const workbook = read(buffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
      // Limpiar datos anteriores
      setData([]);
      setMassImageFile(null);
      setSendAudioMass(false);
      setSelectedMessage(null);
      setMessageResults([]);
      setShowReportOptions(false);
      
      // Establecer nuevos datos
      const jsonData = utils.sheet_to_json<ExcelRow>(worksheet);
      setData(jsonData);
      toast.success('Archivo Excel actualizado correctamente');
    } catch (error) {
      console.error("Error al cargar Excel:", error);
      toast.error('Error al cargar el archivo Excel');
    }

    // Limpiar el input para permitir cargar el mismo archivo
    if (event.target) {
      event.target.value = '';
    }
  }, []);

  const handleReloadFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const canSendWhatsApp = (row: ExcelRow | undefined) => {
    if (!row) return false;
    return row.SMS === '0' || row.SMS === 0;
  };

  const sendMessage = async (phoneNumber: string | number, message: string, imageFile?: File, sendAudio: boolean = false) => {
    try {
      setLoading(true);
      const success = await sendWhatsAppMessage(phoneNumber, message, imageFile, sendAudio);
      if (success) {
        toast.success(`Mensaje enviado a ${phoneNumber}`);
      }
    } catch (error) {
      toast.error(`Error al enviar mensaje a ${phoneNumber}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMassMessage = async () => {
    try {
      setLoading(true);
      setMessageResults([]);
      setShowReportOptions(false);
      
      const eligibleContacts = data.filter(canSendWhatsApp);
      
      if (eligibleContacts.length === 0) {
        toast.error('No hay contactos elegibles para enviar mensajes de WhatsApp');
        return;
      }

      const messages = eligibleContacts.map(row => ({
        phoneNumber: row.CELULAR,
        message: row.TEXTO_MENSAJE,
        name: row.NOMBRES || ''
      }));

      const results = await sendWhatsAppMessageBulk(messages, massImageFile, sendAudioMass);
      
      if (results.length > 0) {
        setMessageResults(results);
        setShowReportOptions(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = (format: 'excel' | 'txt') => {
    if (messageResults.length === 0) {
      toast.error('No hay resultados para generar un reporte');
      return;
    }
    
    downloadMessageReport(messageResults, format);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 16 * 1024 * 1024) {
      toast.error('La imagen es demasiado grande. Máximo 16MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecciona una imagen válida.');
      return;
    }

    setSelectedMessage(prev => prev ? { ...prev, imageFile: file } : null);
    toast.success('Imagen adjuntada correctamente');
  };

  const handleMassImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 16 * 1024 * 1024) {
      toast.error('La imagen es demasiado grande. Máximo 16MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecciona una imagen válida.');
      return;
    }

    setMassImageFile(file);
    toast.success('Imagen masiva adjuntada correctamente');
  };

  // Calcular el número de mensajes a enviar
  const eligibleContactsCount = data.filter(canSendWhatsApp).length;

  // Calcular estadísticas de resultados
  const successCount = messageResults.filter(r => r.success).length;
  const failCount = messageResults.filter(r => !r.success).length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Monitor de Mensajes WhatsApp</h1>
          
          {/* File Upload */}
          <div className="mb-8">
            <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
              <div className="flex flex-col items-center space-y-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="font-medium text-gray-600">
                  Selecciona un archivo Excel
                </span>
                {data.length > 0 && (
                  <button
                    onClick={handleReloadFile}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Actualizar archivo
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Bulk Send Section */}
          {data.length > 0 && (
            <div className="mb-6 space-y-4">
              {/* Mass Image Upload */}
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Opciones de envío masivo</h3>
                  <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {eligibleContactsCount} mensaje{eligibleContactsCount !== 1 ? 's' : ''} para enviar
                  </div>
                </div>
                
                {/* Imagen masiva */}
                {massImageFile ? (
                  <div className="flex items-center space-x-4 mb-4">
                    <img 
                      src={URL.createObjectURL(massImageFile)} 
                      alt="Imagen masiva" 
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setMassImageFile(null)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar imagen
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center w-full h-24 px-4 transition bg-gray-50 border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none mb-4">
                    <div className="flex flex-col items-center space-y-2">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Adjuntar imagen para envío masivo (máx. 16MB)
                      </span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleMassImageUpload}
                    />
                  </label>
                )}

                {/* Opción de audio */}
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="sendAudioMass"
                    checked={sendAudioMass}
                    onChange={(e) => setSendAudioMass(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="sendAudioMass" className="flex items-center text-sm text-gray-700">
                    <Volume2 className="w-4 h-4 mr-1" />
                    Incluir mensaje de voz
                  </label>
                </div>
              </div>

              <button
                onClick={handleSendMassMessage}
                disabled={loading || eligibleContactsCount === 0}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm disabled:opacity-50"
              >
                <SendHorizonal className="w-5 h-5 mr-2" />
                Enviar {eligibleContactsCount} Mensaje{eligibleContactsCount !== 1 ? 's' : ''} Masivos
              </button>
              <p className="text-sm text-gray-600">
                Solo se enviarán mensajes a contactos con SMS = 0
                {massImageFile && " • Se incluirá la imagen seleccionada en todos los mensajes"}
                {sendAudioMass && " • Se incluirá mensaje de voz en todos los mensajes"}
              </p>
            </div>
          )}

          {/* Report Section */}
          {showReportOptions && messageResults.length > 0 && (
            <div className="mb-8 p-4 border-2 border-blue-100 rounded-lg bg-blue-50">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Reporte de Envío</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Total mensajes</p>
                  <p className="text-2xl font-bold">{messageResults.length}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-green-600">Enviados</p>
                  <p className="text-2xl font-bold text-green-700">{successCount}</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-red-600">Fallidos</p>
                  <p className="text-2xl font-bold text-red-700">{failCount}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleDownloadReport('excel')}
                  className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Descargar Reporte Excel
                </button>
                <button
                  onClick={() => handleDownloadReport('txt')}
                  className="inline-flex items-center px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Descargar Reporte TXT
                </button>
              </div>
              
              {failCount > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-red-600 mb-2">Mensajes con error:</h4>
                  <div className="max-h-40 overflow-y-auto bg-white p-2 rounded-md text-sm">
                    {messageResults.filter(r => !r.success).map((result, idx) => (
                      <div key={idx} className="mb-2 pb-2 border-b border-gray-100">
                        <p><span className="font-medium">Teléfono:</span> {result.phoneNumber}</p>
                        {result.error && <p><span className="font-medium">Error:</span> {result.error}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Data Table */}
          {data.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(data[0]).map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((row, index) => (
                    <tr key={index} className={!canSendWhatsApp(row) ? 'bg-gray-50' : ''}>
                      {Object.entries(row).map(([key, value], i) => (
                        <td key={i} className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                          {key === 'TEXTO_MENSAJE' ? (
                            <div className="max-w-xs">
                              <div className="truncate">{value as string}</div>
                              <button
                                onClick={() => setSelectedMessage({ text: value as string, phone: row.CELULAR })}
                                className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                              >
                                Ver mensaje completo
                              </button>
                            </div>
                          ) : (
                            value
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => sendMessage(row.CELULAR, row.TEXTO_MENSAJE)}
                          disabled={loading || !canSendWhatsApp(row)}
                          className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md ${
                            canSendWhatsApp(row)
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          } disabled:opacity-50`}
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Enviar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Mensaje para {selectedMessage.phone}</h3>
            
            {/* Imagen adjunta */}
            {selectedMessage.imageFile ? (
              <div className="mb-4">
                <img 
                  src={URL.createObjectURL(selectedMessage.imageFile)} 
                  alt="Imagen adjunta" 
                  className="max-h-48 rounded-lg"
                />
                <button
                  onClick={() => setSelectedMessage(prev => prev ? { ...prev, imageFile: undefined } : null)}
                  className="mt-2 text-red-600 text-sm hover:text-red-800"
                >
                  Eliminar imagen
                </button>
              </div>
            ) : (
              <div className="mb-4">
                <label className="flex items-center justify-center w-full h-24 px-4 transition bg-gray-50 border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                  <div className="flex flex-col items-center space-y-2">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Adjuntar imagen (máx. 16MB)
                    </span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            )}

            {/* Opción de audio */}
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="sendAudio"
                checked={selectedMessage.sendAudio || false}
                onChange={(e) => setSelectedMessage(prev => prev ? { ...prev, sendAudio: e.target.checked } : null)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="sendAudio" className="flex items-center text-sm text-gray-700">
                <Volume2 className="w-4 h-4 mr-1" />
                Incluir mensaje de voz
              </label>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <p className="whitespace-pre-wrap text-gray-700">{selectedMessage.text}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  const row = data.find(r => r.CELULAR === selectedMessage.phone);
                  if (row && canSendWhatsApp(row)) {
                    sendMessage(
                      selectedMessage.phone,
                      selectedMessage.text,
                      selectedMessage.imageFile,
                      selectedMessage.sendAudio
                    );
                    setSelectedMessage(null);
                  }
                }}
                disabled={!canSendWhatsApp(data.find(r => r.CELULAR === selectedMessage.phone))}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar Mensaje
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;