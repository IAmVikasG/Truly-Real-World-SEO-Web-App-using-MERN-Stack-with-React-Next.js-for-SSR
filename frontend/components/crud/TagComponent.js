import { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { isAuth, getCookie } from '../../actions/auth';
import { create, getTags, removeTag } from '../../actions/tag';

const TagComponent = () =>
{
    const [values, setValues] = useState({
        name: '',
        error: false,
        success: false,
        tags: [],
        removed: false,
        reload: false
    });

    const { name, error, success, tags, removed, reload } = values;
    const token = getCookie('token');

    useEffect(() =>
    {
        loadTag();
    }, [reload]);

    const loadTag = () =>
    {
        getTags().then(result =>
        {
            const { success, data, message } = result;
            if (!success)
            {
                console.log(message);
            } else
            {
                setValues({ ...values, tags: data });
            }
        });
    };

    const showTags = () =>
    {
        return tags.map((c, i) =>
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
        let answer = window.confirm('Are you sure you want to delete this tag?');
        if (answer)
        {
            deleteTag(slug);
        }
    };

    const deleteTag = slug =>
    {
        removeTag(slug, token).then(result =>
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
            return <p className="text-success">Tag is created</p>;
        }
    };

    const showError = () =>
    {
        if (error)
        {
            return <p className="text-danger">Tag already exist</p>;
        }
    };

    const showRemoved = () =>
    {
        if (removed)
        {
            return <p className="text-danger">Tag is removed</p>;
        }
    };

    const mouseMoveHandler = e =>
    {
        setValues({ ...values, error: false, success: false, removed: '' });
    };

    const newTagFom = () => (
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
            {newTagFom()}
            {showTags()}
        </div>
        </>
    );
};

export default TagComponent;
