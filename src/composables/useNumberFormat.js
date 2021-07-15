/**
 * Run the function within a component's setup() and then expose in the return
 *
 * @since 2021-07-15
 */

const numberFormat_1 = new Intl.NumberFormat(
	'en-US',
		{
			minimumFractionDigits: 1,
			maximumFractionDigits: 1
		}
);

const numberFormat_2 = new Intl.NumberFormat(
	'en-US',
	{
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}
);

const numberFormat = numberFormat_2;

const numberFormat_3 = new Intl.NumberFormat(
	'en-US',
	{
		minimumFractionDigits: 3,
		maximumFractionDigits: 3
	}
);

const numberFormat_4 = new Intl.NumberFormat(
	'en-US',
	{
		minimumFractionDigits: 4,
		maximumFractionDigits: 4
	}
);

const format   = (num) => numberFormat.format(num);
const format_1 = (num) => numberFormat_1.format(num);
const format_2 = (num) => numberFormat_2.format(num);
const format_3 = (num) => numberFormat_3.format(num);
const format_4 = (num) => numberFormat_4.format(num);

export default function useNumberFormat() {
	return {
		numberFormat,
		numberFormat_1,
		numberFormat_2,
		numberFormat_3,
		numberFormat_4,
		format,
		format_1,
		format_2,
		format_3,
		format_4,
	}
}
