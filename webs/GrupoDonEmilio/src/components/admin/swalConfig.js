import Swal from 'sweetalert2';

export const adminSwal = Swal.mixin({
    background: '#15181d',
    color: '#ffffff',
    confirmButtonColor: '#ef4444', 
    cancelButtonColor: '#334155',
    customClass: {
        popup: 'border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem]',
        title: 'font-tommy font-black tracking-widest uppercase text-xl text-white mt-4',
        htmlContainer: 'text-slate-400 font-medium text-sm mt-4',
        confirmButton: 'bg-[#ef4444] text-white font-tommy font-black tracking-[0.2em] uppercase text-[10px] rounded-2xl px-6 py-3 shadow-[0_10px_30px_rgba(239,68,68,0.3)] transition-transform hover:-translate-y-1 hover:bg-[#dc2626]',
        cancelButton: 'bg-slate-800 text-white font-tommy font-black tracking-[0.2em] uppercase text-[10px] rounded-2xl px-6 py-3 hover:bg-slate-700 transition-colors border border-white/5',
        actions: 'gap-4 mt-8 mb-4 w-full justify-center flex-wrap flex-row-reverse',
        icon: 'border-white/10 bg-white/5 shrink-0 scale-90 mt-8 mb-0',
    },
    buttonsStyling: false
});
