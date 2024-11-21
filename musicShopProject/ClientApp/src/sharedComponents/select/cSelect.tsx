import { FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, SxProps, Theme } from "@mui/material"
import React, { MutableRefObject, useMemo } from "react"
import DeleteIcon from '@mui/icons-material/Delete';

export interface IProps<TValue> {
    label: string
    emptyLabel?: string
    disabled?: boolean
    value: TValue | null
    options: TValue[]
    defaultValue?: string
    onChange: (values: TValue | null, isCleared: boolean) => void
    getOptionLabel: (value: TValue) => string
    getOptionValue: (value: TValue) => string | number
    renderValue?: (option: TValue) => React.ReactNode
    renderOption?: (option: TValue) => React.ReactNode
    clearable?: boolean
    sx?: SxProps<Theme>
    className?: string
    ref?: MutableRefObject<null>
    onFocus?: () => void;
    onBlur?: () => void;
}

export const CSelect = <TValue,>(props: IProps<TValue>) => {
    const selectSx: SxProps<Theme> | undefined = useMemo(() => {
        if (!props.clearable) return;

        return {
            "& .MuiSelect-iconOutlined": { display: 'none' },
            "&.Mui-focused .MuiIconButton-root": { color: 'primary.main' },
            "&.MuiInputBase-adornedEnd": { pr: 0 }
        }
    }, [props.clearable])

    const endAdornment: React.ReactNode | undefined = useMemo(() => {
        if (!props.clearable) return;

        return (
            <IconButton sx={{ position: 'absolute', right: 2 }} onClick={() => props.onChange(null, true)}>
                <DeleteIcon />
            </IconButton>
        )
    }, [props.clearable, props.value])

    function onChange(event: SelectChangeEvent<string>): void {
        const existOption = props.options.find(o => props.getOptionValue(o).toString() === event.target.value);
        const isCleared = existOption === undefined;

        props.onChange(existOption ?? null, isCleared);
    }

    function renderValue(value: string) {
        const selectedOption = props.options.find(o => props.getOptionValue(o).toString() === value) ?? null;

        if (selectedOption === null) {
            if (!props.emptyLabel)
                return ""
            else
                return props.emptyLabel;
        }

        if (props.renderValue)
            return props.renderValue(selectedOption);
        else
            return props.getOptionLabel(selectedOption);
    }

    function isSelected(option: TValue) {
        return props.getOptionValue(option) === (props.value !== null ? props.getOptionValue(props.value) : null);
    }

    function renderOptions() {
        return (
            props.options.map((option, index) => (
                <MenuItem selected={isSelected(option)} key={index} value={props.getOptionValue(option).toString()}>
                    {props.renderOption ? props.renderOption!(option) : props.getOptionLabel(option)}
                </MenuItem>
            ))
        )
    }

    return (
        <FormControl fullWidth sx={{ ...props.sx }} className={props.className}>
            <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
            <Select
                size="small"
                ref={props.ref}
                disabled={props.disabled}
                label={props.label}
                placeholder={props.label}
                value={props.value !== null ? props.getOptionValue(props.value).toString() : " "}
                defaultValue={props.defaultValue}
                onChange={onChange}
                renderValue={renderValue}
                onFocus={props.onFocus}
                onBlur={props.onBlur}
                sx={selectSx}
                endAdornment={endAdornment}
            >
                {renderOptions()}
            </Select>
        </FormControl>
    )
}