'use client';

interface ShowModalProps {
    isDarkMode: boolean;
    modalMessage: string;
    modalConfirmAction?: () => void;
    setShowModal: (show: boolean) => void;
}

export default function ShowModal({ isDarkMode, modalMessage, modalConfirmAction, setShowModal }: ShowModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className={`${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-900'} p-6 rounded-xl shadow-xl max-w-sm w-full mx-4`}>
                {/* <p className="mb-4">{modalMessage}</p> */}
                <div className="max-h-60 overflow-y-auto mb-4">
                    <p className="whitespace-pre-line">{modalMessage}</p>
                </div>
                <div className="flex justify-end space-x-3">
                    {modalConfirmAction && (
                        <button
                            onClick={() => {
                                modalConfirmAction();
                                setShowModal(false);
                            }}
                            className={`px-3 py-1.5 ${isDarkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white'} rounded-full text-sm hover:${isDarkMode ? 'bg-red-700' : 'bg-red-600'} focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors shadow-sm`}
                        >
                            Confirm
                        </button>
                    )}
                    <button
                        onClick={() => setShowModal(false)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors shadow-sm ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'} focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}
