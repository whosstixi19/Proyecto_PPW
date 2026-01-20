package dao;

import java.util.List;
import java.util.Optional;

public interface CrudDAO<T> {
    T create(String id, T entity);

    Optional<T> findById(String id);

    List<T> findAll();

    T update(String id, T entity);

    boolean delete(String id);

    void clear();
}
