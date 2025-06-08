
import React from 'react';

export const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const XCircleIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const ArrowPathIcon: React.FC<{className?: string}> = ({ className }) => ( // Spinner
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 animate-spin ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

export const InformationCircleIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
  </svg>
);

export const SparklesIcon: React.FC<{className?: string}> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L21 5.25l-.813 2.846a4.5 4.5 0 0 0-3.09 3.09L14.25 12l2.846.813a4.5 4.5 0 0 0 3.09 3.09L21 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L14.25 12Z" />
</svg>
);

export const UserCircleIconSolid: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${className}`}>
    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
  </svg>
);

export const CpuChipIconSolid: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${className}`}>
    <path fillRule="evenodd" d="M7.502 5.438c0-1.314 1.066-2.38 2.38-2.38h4.242c1.314 0 2.38 1.066 2.38 2.38v.001h1.532a.75.75 0 0 1 .75.75v3.188a.75.75 0 0 1-.75.75h-1.534c.002.046.002.092.002.138v4.242c0 .046-.002.092-.004.138h1.536a.75.75 0 0 1 .75.75v3.188a.75.75 0 0 1-.75.75h-1.532v.001c0 1.314-1.066 2.38-2.38 2.38H9.882c-1.314 0-2.38-1.066-2.38-2.38v-.001H5.97a.75.75 0 0 1-.75-.75V15.31a.75.75 0 0 1 .75-.75h1.534c-.002-.046-.002-.092-.002-.138V10.19c0-.046.002-.092.004-.138H5.968a.75.75 0 0 1-.75-.75V6.188a.75.75 0 0 1 .75-.75h1.532v-.001Zm-.752 11.188a.75.75 0 0 1 .75-.75h.002c.048 0 .094.002.14.004V10.19a2.378 2.378 0 0 0-.14-.003h-.002a.75.75 0 0 1-.75-.75V6.31a.75.75 0 0 1 .75-.75h1.63c.097-.623.634-1.125 1.25-1.212V4.502c0-.414.336-.75.75-.75h4.242a.75.75 0 0 1 .75.75v.001c.616.087 1.153.59 1.25 1.212h1.63a.75.75 0 0 1 .75.75v3.128a.75.75 0 0 1-.75.75h-.002c-.048 0-.094-.002-.14-.004v4.688c.046.002.092.004.14.004h.002a.75.75 0 0 1 .75.75v3.128a.75.75 0 0 1-.75.75h-1.63c-.097.623-.634 1.125-1.25 1.212v.001a.75.75 0 0 1-.75.75H9.882a.75.75 0 0 1-.75-.75v-.001c-.616-.087-1.153-.59-1.25-1.212H6.25a.75.75 0 0 1-.75-.75v-3.128Z" clipRule="evenodd" />
  </svg>
);

export const ServerStackIconSolid: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${className}`}>
    <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9H3.75v3.75a.75.75 0 0 0 .75.75h15a.75.75 0 0 0 .75-.75V11.25Zm0-3.75H3.75V18h16.5V7.5Z" clipRule="evenodd" />
  </svg>
);
export const CircleStackIconSolid: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${className}`}>
        <path fillRule="evenodd" d="M12.75 2.25A.75.75 0 0012 3v.759c0 .74-.477 1.393-1.196 1.666-.307.118-.63.178-.954.178H7.875c-.74 0-1.393-.477-1.666-1.196A2.25 2.25 0 004.5 5.255V9c0 .828.672 1.5 1.5 1.5h12A1.5 1.5 0 0019.5 9V5.255a2.25 2.25 0 00-1.709-2.181C17.067 2.796 16.5 2.25 15.759 2.25H12.75zM4.5 12.75a.75.75 0 000 1.5h15a.75.75 0 000-1.5h-15zM4.5 16.5a.75.75 0 000 1.5h15a.75.75 0 000-1.5h-15z" clipRule="evenodd" />
    </svg>
);

export const FlagIconSolid: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${className}`}>
    <path d="M14.707 5.293a1 1 0 0 0-1.414 0L12 6.586l-1.293-1.293a1 1 0 0 0-1.414 1.414L10.586 8l-1.293 1.293a1 1 0 1 0 1.414 1.414L12 9.414l1.293 1.293a1 1 0 0 0 1.414-1.414L13.414 8l1.293-1.293a1 1 0 0 0 0-1.414Z" />
    <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5a.75.75 0 0 0 1.5 0v-6.326a4.502 4.502 0 0 1 3.425-1.575C12.261 12.124 15 9.5 15 9.5s2.215-.228 3.655 1.119a.75.75 0 0 0 1.14-.993A5.973 5.973 0 0 0 15.75 7.5c-2.097 0-3.958 1.442-5.085 2.525C9.999 10.687 9.214 11.25 7.5 11.25A3.001 3.001 0 0 0 4.5 8.25V2.25Z" clipRule="evenodd" />
  </svg>
);

export const EyeIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

export const EyeSlashIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.524M4.261 4.261A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.524" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m1.5 1.5 21 21M9.75 9.75A2.25 2.25 0 0 1 12 7.5c.907 0 1.697.502 2.072 1.251m-4.345 4.345A2.25 2.25 0 0 1 7.5 12c0-.907.502-1.697 1.251-2.072M14.25 14.25a2.25 2.25 0 0 1-2.072 1.251A2.25 2.25 0 0 1 9.75 12M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.524" />
</svg>
);

export const FolderOpenIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    {/* Simplified path for folder open, there were duplicates */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
     <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75M12.75 6H4.5a2.25 2.25 0 0 0-2.25 2.25v.75" />
</svg>
);

export const EnvelopeIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);

export const PlusCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
