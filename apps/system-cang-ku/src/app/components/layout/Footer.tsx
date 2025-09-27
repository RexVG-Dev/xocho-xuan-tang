export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="h-14 bg-white border-t border-gray-200 flex items-center justify-between px-6">
      <p className="text-sm text-gray-500">
        &copy;Todos los derechos reservados.
      </p>
      <p className="text-sm text-gray-500">
        Xocho Cosmetics Querétaro {currentYear}
      </p>
    </footer>
  );
}

export default Footer;