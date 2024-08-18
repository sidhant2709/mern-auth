import { forwardRef } from 'react';

const Input = forwardRef(({ icon: Icon, errors, ...props }, ref) => {
    const hasError = errors && errors[props.name];
    return (
        <div className="mb-6">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Icon className="size-5 text-green-500" />
                </div>
                <input
                    {...props}
                    ref={ref}
                    className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
                    onBlur={props.onBlur}
                    onChange={props.onChange}
                />
            </div>
            {hasError && <span className="text-red-500 pl-2">{errors[props.name].message}</span>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
