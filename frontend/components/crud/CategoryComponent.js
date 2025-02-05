import { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { isAuth, getCookie } from '../../actions/auth';
import { create, getCategories, removeCategory } from '../../actions/category';

const CategoryComponent = () =>
{
    const [values, setValues] = useState({
        name: '',
        error: false,
        success: false,
        categories: [],
        removed: false,
        reload: false
    });

    const { name, error, success, categories, removed, reload } = values;
    const token = getCookie('token');

    useEffect(() =>
    {
        loadCategories();
    }, [reload]);

    const loadCategories = () =>
    {
        getCategories().then(result =>
        {
            const { success, data, message } = result;
            if (!success)
            {
                console.log(message);
            } else
            {
                setValues({ ...values, categories: data });
            }
        });
    };

    const showCategories = () =>
    {
        return categories.map((c, i) =>
        {
            return (
                <button
                    onDoubleClick={() => deleteConfirm(c.slug)}
                    title="Double click to delete"
                    key={i}
                    className="btn btn-outline-primary mr-1 ml-1 mt-3"
                >
                    {c.name}
                </button>
            );
        });
    };

    const deleteConfirm = slug =>
    {
        let answer = window.confirm('Are you sure you want to delete this category?');
        if (answer)
        {
            deleteCategory(slug);
        }
    };

    const deleteCategory = slug =>
    {
        removeCategory(slug, token).then(result =>
        {
            const { success, message } = result;
            if (!success)
            {
                console.log(message);
            } else
            {
                setValues({ ...values, error: false, success: false, name: '', removed: !removed, reload: !reload });
            }
        });
    };

    const clickSubmit = e =>
    {
        e.preventDefault();
        create({ name }, token).then(result =>
        {
            const { success, message } = result;
            if (!success)
            {
                setValues({ ...values, error: message, success: false });
            } else
            {
                setValues({ ...values, error: false, success: true, name: '', reload: !reload });
            }
        });
    };

    const handleChange = e =>
    {
        setValues({ ...values, name: e.target.value, error: false, success: false, removed: '' });
    };

    const showSuccess = () =>
    {
        if (success)
        {
            return <p className="text-success">Category is created</p>;
        }
    };

    const showError = () =>
    {
        if (error)
        {
            return <p className="text-danger">Category already exist</p>;
        }
    };

    const showRemoved = () =>
    {
        if (removed)
        {
            return <p className="text-danger">Category is removed</p>;
        }
    };

    const mouseMoveHandler = e =>
    {
        setValues({ ...values, error: false, success: false, removed: '' });
    };

    const newCategoryFom = () => (
        <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input type="text" className="form-control" onChange={handleChange} value={name} required />
            </div>
            <div>
                <button type="submit" className="btn btn-primary">
                    Create
                </button>
            </div>
        </form>
    );

    return (
        <>
        {showSuccess()}
        {showError()}
        {showRemoved()}
        <div onMouseMove={mouseMoveHandler}>
            {newCategoryFom()}
            {showCategories()}
        </div>
        </>
    );
};

export default CategoryComponent;
