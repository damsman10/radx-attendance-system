const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <h1 className="text-6xl font-bold text-blue-600">
        404
      </h1>

      <p className="text-xl mt-4 text-gray-600 dark:text-gray-300">
        Page not found
      </p>
    </div>
  );
};

export default NotFound;